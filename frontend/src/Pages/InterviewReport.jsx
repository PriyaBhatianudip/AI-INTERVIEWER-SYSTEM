import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LabelList,
  Cell,
} from "recharts";

export default function InterviewReport() {
  const { interviewId } = useParams();
  const [report, setReport] = useState(null);
  const [showRadar, setShowRadar] = useState(false);

  /* ================= FETCH REPORT ================= */
  useEffect(() => {
    api.get(`/user/reports/${interviewId}`).then((res) => {
      setReport(res.data);
    });
  }, [interviewId]);

  if (!report) return null;

  /* ================= CHART DATA ================= */
  const chartData = [
    { name: "Accuracy", score: report.accuracy, color: "#22c55e" },
    { name: "Relevance", score: report.relevance, color: "#f59e0b" },
    { name: "Communication", score: report.communication, color: "#3b82f6" },
  ];

  /* ================= PDF DOWNLOAD ================= */
  const downloadPDF = () => {
    // ✔ Direct download – NO new tab, NO canvas
    window.location.href = `${import.meta.env.VITE_AI_ENGINE_URL}/reports/${interviewId}/pdf`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Interview Report
            </h1>
            <p className="text-gray-600">{report.jobRole}</p>
          </div>

          <button
            onClick={downloadPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
          >
            Download PDF
          </button>
        </div>

        {/* ================= SCORE CARDS ================= */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            ["Overall", report.overallScore],
            ["Accuracy", report.accuracy],
            ["Relevance", report.relevance],
            ["Communication", report.communication],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-gray-50 shadow rounded-xl p-4 text-center"
            >
              <p className="text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-indigo-600">
                {value?.toFixed(1)}
              </p>
            </div>
          ))}
        </div>

        {/* ================= CHART (50% WIDTH CARD) ================= */}
        <div className="bg-gray-50 shadow rounded-2xl p-6 max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-indigo-900">
              Skill-wise Performance
            </h2>
            <button
              onClick={() => setShowRadar(!showRadar)}
              className="text-sm text-indigo-600"
            >
              {showRadar ? "Switch to Bar" : "Switch to Radar"}
            </button>
          </div>

          {/* IMPORTANT: fixed height prevents recharts warnings */}
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {showRadar ? (
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              ) : (
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                    <LabelList dataKey="score" position="top" />
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= STRENGTHS & IMPROVEMENTS ================= */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 shadow rounded-xl p-6">
            <h3 className="font-semibold mb-3">Strengths</h3>
            <ul className="list-disc pl-5 space-y-1">
              {report.strengths?.length
                ? report.strengths.map((s, i) => <li key={i}>{s}</li>)
                : <li className="italic text-gray-500">No strengths listed</li>}
            </ul>
          </div>

          <div className="bg-gray-50 shadow rounded-xl p-6">
            <h3 className="font-semibold mb-3">Areas for Improvement</h3>
            <ul className="list-disc pl-5 space-y-1">
              {report.improvementAreas?.length
                ? report.improvementAreas.map((s, i) => <li key={i}>{s}</li>)
                : <li className="italic text-gray-500">No improvements listed</li>}
            </ul>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="bg-gray-50 shadow rounded-xl p-6">
          <h3 className="font-semibold mb-2">AI Interview Summary</h3>
          <p className="text-gray-700">{report.summaryText}</p>
        </div>
      </div>
    </div>
  );
}
