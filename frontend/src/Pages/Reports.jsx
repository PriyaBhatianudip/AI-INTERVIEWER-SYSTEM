import { useEffect, useState } from "react";
import { Calendar, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REPORTS ================= */
  useEffect(() => {
    if (!user?.id) return;

    console.log("Fetching reports for user:", user.id);

    api
      .get("/user/reports", {
        params: { userId: user.id },
      })
      .then((res) => {
        console.log("REPORTS RESPONSE:", res.data);
        setReports(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch reports", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-900">
          Interview Reports
        </h1>
        <p className="text-gray-600 mt-2">
          View and download your AI-generated interview reports
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-600 text-lg">
          Loading reports...
        </div>
      )}

      {/* EMPTY */}
      {!loading && reports.length === 0 && (
        <div className="bg-white p-10 rounded-3xl shadow text-center text-gray-600">
          <p className="text-lg font-medium">No reports available yet</p>
          <p className="text-sm mt-2">
            Complete an interview to generate your first report.
          </p>
        </div>
      )}

      {/* REPORT LIST */}
      {!loading && reports.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => (
            <div
              key={r.interviewId}
              className="bg-white rounded-3xl shadow-xl p-6 flex flex-col
                         transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-indigo-900">
                    {r.jobRole || "Interview"}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Calendar size={14} />
                    {r.generatedAt
                      ? new Date(r.generatedAt).toLocaleDateString()
                      : "—"}
                  </div>
                </div>

                <ScoreRing value={r.finalScore} />
              </div>

              {/* SUMMARY */}
              <div className="text-sm text-gray-600 line-clamp-4 mb-4">
                {r.summaryText || "AI summary not available"}
              </div>

              {/* ACTIONS */}
              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => navigate(`/reports/${r.interviewId}`)}
                  className="flex-1 flex items-center justify-center gap-2
                             bg-indigo-600 hover:bg-indigo-700 text-white
                             py-2 rounded-full text-sm font-medium"
                >
                  <Eye size={16} /> View Report
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_AI_ENGINE_URL}/reports/${r.interviewId}/pdf`,
                      "_blank"
                    )
                  }
                  className="flex items-center justify-center gap-2
                             px-4 py-2 rounded-full
                             bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SCORE RING ================= */
function ScoreRing({ value }) {
  const normalized =
    value != null ? Math.min(100, Math.max(0, value * 10)) : 0;

  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#6366f1"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * normalized) / 100}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-sm font-bold text-indigo-700">
          {value?.toFixed(1) ?? "—"}
        </div>
        <div className="text-[10px] text-gray-500">Score</div>
      </div>
    </div>
  );
}
