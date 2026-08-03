import React, { useEffect, useRef, useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import SkillRadarChart from "../Components/SkillRadarChart";
import PracticeModePopup from "../Components/PracticeModePopUp";
import { useLocation } from "react-router-dom";

/* ================= CONSTANTS ================= */
const TOTAL_QUESTIONS = 5;
const TOTAL_TIME = 5 * 60;


const round2 = (v) =>
  v !== null && v !== undefined ? Number(v).toFixed(2) : "0.00";

export default function InterviewDashboard() {
  /* ================= AUTH ================= */
  const { user } = useAuth();
  const userName = user?.name || "User";

  /* ================= ROUTE STATE (NEW) ================= */
const location = useLocation();
const jdAnalysis = location.state?.jdAnalysis || null;
const jobRoleFromRoute = location.state?.jobRole || null;


  /* ================= PRACTICE MODE ================= */
  const [showPracticePopup, setShowPracticePopup] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  /* ================= INTERVIEW STATE ================= */
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /* ================= VOICE STATE ================= */
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const voiceBufferRef = useRef("");
  const isStoppingRef = useRef(false);

  /* ================= DERIVED ================= */
  const currentQuestion = questions[currentIndex];
  const jobRoleString =
  jdAnalysis?.jobRole ||
  jobRoleFromRoute ||
  (selectedInterview && selectedInterview.technology
    ? `${selectedInterview.interviewType} – ${selectedInterview.technology}`
    : "");

  /* ================= TIMER ================= */
  useEffect(() => {
  if (!interviewId || report) return;

  const timer = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        clearInterval(timer);
        finishInterview();   // 🔥 IMPORTANT
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [interviewId, report]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  /* ================= START INTERVIEW ================= */
  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await api.post("/interview/start", null, {
        params: { userId: user.id, jobRole: jobRoleString },
      });

      const id = res.data.id;
      setInterviewId(id);

      let qRes;

if (jdAnalysis || jobRoleFromRoute) {
  qRes = await api.post("/ai/generate-questions", {
    jobRole: jdAnalysis?.jobRole || jobRoleFromRoute,
    skills: jdAnalysis?.skills || [],
    experienceLevel: jdAnalysis?.experienceLevel || "mid",
    count: TOTAL_QUESTIONS,
  });
} else {
  qRes = await api.get(`/interview/${id}/questions`, {
    params: { jobRole: jobRoleString },
  });
}

const normalized = (qRes.data.questions || qRes.data).map((q, i) => ({
  ...q,
  id: q.id ?? i + 1,
  questionText: q.questionText || q.question,
}));

setQuestions(normalized.slice(0, TOTAL_QUESTIONS));

      setAnswersMap({});
      setCurrentIndex(0);
      setTimeLeft(TOTAL_TIME);
      setReport(null);
    } catch (e) {
      console.error(e);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ANSWER HANDLING ================= */
  const handleAnswerChange = (value) => {
    if (!currentQuestion) return;
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  /* ================= SPEECH ================= */
  const stopSpeech = () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (e) {
      console.warn("Speech stop ignored", e);
    } finally {
      setIsListening(false);
      setTimeout(() => (isStoppingRef.current = false), 300);
    }
  };

  const startSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    stopSpeech();

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    voiceBufferRef.current = answersMap[currentQuestion.id] || "";
    setIsListening(true);

    recognitionRef.current.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript;
      voiceBufferRef.current += " " + text;
      handleAnswerChange(voiceBufferRef.current.trim());
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  };

  const speakQuestion = () => {
    if (!window.speechSynthesis || !currentQuestion) return;
    const u = new SpeechSynthesisUtterance(currentQuestion.questionText);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  /* ================= FINISH ================= */
  const finishInterview = async () => {
  if (isSubmitting) return; // ⛔ prevent double submit
  setIsSubmitting(true);

  try {
    // HARD stop speech safely
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);

    const payload = questions.map((q) => ({
      candidate_id: user.id,
      interview_session_id: interviewId,
      question_id: q.id,
      candidate_answer: answersMap[q.id] || "",
    }));

    await api.post(`/interview/${interviewId}/submit-all`, payload);

    const summaryRes = await api.get(
      `/interview/${interviewId}/summary`
    );

    const d = summaryRes.data;

    setReport({
      ...d,
      overall_rating_10: d.overall_rating_10 ?? 0,
      averageAccuracy: d.averageAccuracy ?? 0,
      averageRelevance: d.averageRelevance ?? 0,
      averageCommunication: d.averageCommunication ?? 0,
      strengths: d.strengths || [],
      improvementAreas: d.improvement_areas || [],
      learningPath: d.learning_path || [],
      summaryParagraphs: d.summary_paragraphs || [],
      recommendation: d.recommendation,
    });
  } catch (e) {
    console.error(e);
    alert("Failed to submit interview");
  } finally {
    setIsSubmitting(false);
  }
};


  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              stopSpeech();
              setShowPracticePopup(true);
            }}
            className="bg-orange-500 text-white px-4 py-1.5 rounded-full"
          >
            Select Practice Mode
          </button>
          <span className="font-semibold text-indigo-700">
            {jobRoleString || "Not selected"}
          </span>
        </div>

        {interviewId && !report && (
          <div className="bg-white px-4 py-1 rounded-full shadow">
            ⏱ {minutes}:{seconds}
          </div>
        )}
      </div>

      {/* START */}
      {!interviewId && (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold">
            Welcome, <span className="text-orange-500">{userName}</span>
          </h1>
          <button
            onClick={startInterview}
            disabled={loading || !jobRoleString}
            className="mt-6 px-8 py-3 rounded-full bg-orange-500 text-white"
          >
            {loading ? "Starting..." : "Start Practice"}
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {interviewId && currentQuestion && !report && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mt-10">
          <div className="flex gap-2 mb-4">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-full font-semibold ${
                  i === currentIndex
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <h2 className="font-semibold mb-4 text-lg">
            {currentQuestion.questionText}
          </h2>

          <div className="flex gap-3 mb-3">
            <button
              onClick={speakQuestion}
              className="px-4 py-2 bg-blue-100 rounded-full flex items-center gap-2"
            >
              <Volume2 size={16} /> Speak Question
            </button>

            <button
              onClick={startSpeech}
              className="px-4 py-2 bg-indigo-100 rounded-full flex items-center gap-2"
            >
              <Mic size={16} /> Speak Answer
            </button>
          </div>

          <textarea
            rows={5}
            disabled={isListening}
            className={`w-full border rounded-xl p-4 ${
              isListening ? "bg-gray-100" : ""
            }`}
            value={answersMap[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />

          {isListening && (
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={stopSpeech}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-full"
              >
                ⏹ Stop Recording
              </button>
              <span className="text-indigo-600 animate-pulse">
                🎤 Listening…
              </span>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-4 py-2 bg-gray-200 rounded-full"
            >
              ← Prev
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
  onClick={finishInterview}
  disabled={isSubmitting}
  className={`px-6 py-2 rounded-full text-white ${
    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500"
  }`}
>
  {isSubmitting ? "Submitting..." : "Finish Test"}
</button>

            ) : (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="bg-orange-500 text-white px-6 py-2 rounded-full"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      {/* REPORT */}
      {report && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow mt-10 space-y-6">
          <h2 className="text-2xl font-bold text-indigo-800">
            📊 Interview Performance
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Score label="Overall" value={round2(report.overall_rating_10)} />
            <Score label="Accuracy" value={round2(report.averageAccuracy)} />
            <Score label="Relevance" value={round2(report.averageRelevance)} />
            <Score label="Communication" value={round2(report.averageCommunication)} />
          </div>

          <SkillRadarChart report={report} />

          <Section title="✅ Strengths" items={report.strengths} />
          <Section title="⚠ Areas for Improvement" items={report.improvementAreas} />
          <Section title="📘 Learning Path" items={report.learningPath} />

          <button
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_AI_ENGINE_URL}/reports/${interviewId}/pdf`,
                "_blank"
              )
            }
            className="bg-indigo-600 text-white px-6 py-2 rounded-full"
          >
            ⬇ Download PDF
          </button>
        </div>
      )}

      <PracticeModePopup
        open={showPracticePopup}
        onClose={() => setShowPracticePopup(false)}
        onSelect={(i) => {
          stopSpeech();
          setSelectedInterview(i);
          setShowPracticePopup(false);
        }}
      />
    </div>
  );
}

/* ================= HELPERS ================= */
function Score({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-indigo-700">{value}</p>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc list-inside text-sm">
        {items.length
          ? items.map((i, idx) => <li key={idx}>{i}</li>)
          : <li className="italic text-gray-500">None</li>}
      </ul>
    </div>
  );
}