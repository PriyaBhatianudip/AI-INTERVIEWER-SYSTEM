import { useEffect, useState } from "react";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= ANIMATIONS ================= */
const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

/* ================= HELPERS ================= */
const clampPct = (v) => Math.min(100, Math.max(5, v * 10));

const getMetricColor = (value) => {
  if (value >= 7) return "bg-green-500";
  if (value >= 5) return "bg-yellow-400";
  return "bg-red-500";
};

const getScoreColor = (score) => {
  if (score >= 7) return "#22c55e";
  if (score >= 5) return "#facc15";
  return "#ef4444";
};

export default function CompareInterview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [compare, setCompare] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      api.get("/user/reports/compare", { params: { userId: user.id } }),
      api.get("/user/reports", { params: { userId: user.id } }),
    ])
      .then(([compareRes, trendRes]) => {
        setCompare(compareRes.data);

        const trendData = trendRes.data
          .sort((a, b) => new Date(a.generatedAt) - new Date(b.generatedAt))
          .map((r, idx) => ({
            name: `Interview ${idx + 1}`,
            score: r.finalScore,
          }));

        setTrend(trendData);
      })
      .catch(() => {
        setCompare(null);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading comparison...
      </div>
    );
  }

  if (!compare) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Complete at least two interviews to compare performance.
      </div>
    );
  }

  const {
  previous,
  recent,
  highlights = [],
  aiComparisonSummary,
  accuracyDiff,
  relevanceDiff,
  communicationDiff,
  overallDiff
} = compare;

const aiSummary =
  aiComparisonSummary || "AI comparison summary will be available soon.";

const diffs = {
  Accuracy: accuracyDiff,
  Relevance: relevanceDiff,
  Communication: communicationDiff,
  Overall: overallDiff,
};



  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 pb-20"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ================= HEADER ================= */}
      <div className="w-[90%] mx-auto pt-8">
        <motion.h1
          className="text-4xl font-extrabold text-indigo-900"
          variants={item}
        >
          Compare Interviews
        </motion.h1>
        <motion.p className="text-gray-600 mt-2" variants={item}>
          See how your interview performance has evolved over time
        </motion.p>
      </div>

      {/* ================= CARDS ================= */}
      <motion.section
        className="w-[90%] mx-auto mt-12 grid md:grid-cols-2 gap-10"
        variants={container}
      >
        <CompareCard title="Previous Interview" data={previous} navigate={navigate} />
        <CompareCard title="Recent Interview" data={recent} navigate={navigate} />
      </motion.section>

      {/* ================= INSIGHTS ================= */}
      <motion.section
        className="w-[90%] mx-auto mt-14 bg-white rounded-3xl shadow p-8"
        variants={container}
      >
        <motion.h3
          className="text-xl font-semibold text-indigo-900 mb-4"
          variants={item}
        >
          Performance Insights
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.keys(diffs).length > 0 ? (
  Object.entries(diffs).map(([k, v]) => (
    <InsightCard key={k} label={k} diff={v} />
  ))
) : (
  <p className="text-sm text-gray-500">
    Insights will appear once comparison metrics are available.
  </p>
)}

        </div>

        {/* AI SUMMARY */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-50 p-6 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🤖</span>
            <h4 className="font-semibold text-indigo-900">
              AI Comparison Summary
            </h4>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {aiSummary}
          </p>
        </div>
      </motion.section>

      {/* ================= TREND ================= */}
      <motion.section
        className="w-[90%] mx-auto mt-14 bg-white rounded-3xl shadow p-8"
        variants={container}
      >
        <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Performance Trend
        </h3>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* ================= SUMMARY ================= */}
      <motion.section
        className="w-[90%] mx-auto mt-14 bg-white rounded-3xl shadow p-8"
        variants={container}
      >
        <h3 className="text-xl font-semibold text-indigo-900 mb-4">
          Progress Summary
        </h3>
        <ul className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          {highlights.map((h, i) => (
            <li key={i} className="bg-indigo-50 rounded-xl px-4 py-3">
              ✅ {h}
            </li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  );
}

/* ================= COMPONENTS ================= */

function CompareCard({ title, data, navigate }) {
  const scoreColor = getScoreColor(data.overallScore);

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>
      <p className="text-sm text-gray-500">{data.jobRole}</p>

      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(data.date).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {data.durationMinutes} mins
        </span>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <ScoreCircle value={data.overallScore} color={scoreColor} />
        <div className="flex-1 space-y-3">
          <Metric label="Accuracy" value={data.accuracy} />
          <Metric label="Relevance" value={data.relevance} />
          <Metric label="Communication" value={data.communication} />
        </div>
      </div>

      <button
        onClick={() => navigate(`/reports/${data.interviewId}`)}
        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-full font-semibold"
      >
        View Full Report
      </button>
    </motion.div>
  );
}

function ScoreCircle({ value, color }) {
  const pct = clampPct(value);

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * pct) / 100}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold" style={{ color }}>
          {value.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500">Score</div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-2 rounded-full ${getMetricColor(value)}`}
          style={{ width: `${clampPct(value)}%` }}
        />
      </div>
    </div>
  );
}

function InsightCard({ label, diff }) {
  const positive = diff > 0;
  const bg = positive
    ? "from-green-100 to-green-50 text-green-700"
    : "from-red-100 to-red-50 text-red-700";

  return (
    <div className={`rounded-xl p-4 bg-gradient-to-r ${bg}`}>
      <div className="font-semibold">{label}</div>
      <div className="text-sm">
        {positive ? "Improved" : "Declined"} ({diff.toFixed(1)})
      </div>
    </div>
  );
}
