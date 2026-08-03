import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProgressLineChart from "../Components/Charts/ProgressLineChart";
import { api } from "../services/api";

export default function ProgressPage() {
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = 1; // 🔁 replace with auth user later

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);

      const [summaryRes, timelineRes] = await Promise.all([
        api.get(`/progress/summary`, { params: { userId } }),
        api.get(`/progress/timeline`, { params: { userId } }),
      ]);

      setSummary(summaryRes.data);
      setTimeline(timelineRes.data || []);
    } catch (err) {
      console.error("Progress API failed", err);
      setError("Unable to load progress data right now.");
    } finally {
      setLoading(false);
    }
  };

  const getTrend = () => {
    if (timeline.length < 2) return "--";
    const last = timeline[timeline.length - 1].score;
    const prev = timeline[timeline.length - 2].score;
    if (last > prev) return "📈 Improving";
    if (last < prev) return "📉 Declining";
    return "➖ Stable";
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading progress...</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-900">
          Progress & Performance
        </h1>
        <p className="text-gray-500">
          Track your interview growth and performance over time.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Overall Score"
          value={`${(summary?.overallScore || 0).toFixed(2)}%`}
          subtitle="Average performance"
          color="from-purple-500 to-indigo-500"
        />

        <SummaryCard
          title="Interviews Taken"
          value={summary?.interviewsTaken ?? 0}
          subtitle="Total attempts"
          color="from-blue-500 to-cyan-500"
        />

        <SummaryCard
          title="Last Interview"
          value={summary?.lastInterviewDate ?? "--"}
          subtitle="Most recent session"
          color="from-pink-500 to-rose-500"
        />

        <SummaryCard
          title="Trend"
          value={getTrend()}
          subtitle="Current performance trend"
          color="from-green-500 to-emerald-500"
        />
      </div>

      {/* PROGRESS LINE CHART */}
      <ProgressLineChart data={timeline} />

      {/* SKILL WISE ANALYSIS */}
      <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-400">
        Skill-wise analysis and AI insights will appear here soon.
      </div>
    </div>
  );
}

/* -------------------- CARD COMPONENT -------------------- */

function SummaryCard({ title, value, subtitle, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-2xl p-6 text-white shadow bg-gradient-to-br ${color}`}
    >
      <h3 className="text-sm opacity-80">{title}</h3>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <p className="text-sm opacity-80 mt-1">{subtitle}</p>
    </motion.div>
  );
}
