import { motion } from "framer-motion";
import LoginNavbar from "../../Components/LoginNavbar";
import { FaArrowRight } from "react-icons/fa";

/* ================= MOCK DATA ================= */
const previousReport = {
  name: "Sarah M.",
  role: "Technical Interview - IT & Engineering",
  date: "April 10, 2024",
  duration: "16 minutes",
  overall: 7.2,
  accuracy: 8.0,
  communication: 7.0,
  confidence: 6.5,
  takeaway:
    "Solid technical knowledge, needs to improve confidence and provide more examples.",
};

const recentReport = {
  name: "Recent Interview",
  role: "Technical Interview",
  date: "April 10, 2024",
  duration: "16 minutes",
  overall: 7.8,
  accuracy: 8.2,
  communication: 7.5,
  confidence: 6.8,
  takeaway:
    "Improved confidence, provided clearer answers with specific examples.",
};

export default function InterviewReport() {
  return (
    <>
      <LoginNavbar />

      {/* PAGE WRAPPER */}
      <div className="min-h-screen pt-24 px-6 bg-gradient-to-b from-indigo-200/60 via-indigo-100 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* BREADCRUMB */}
          <p className="text-sm text-indigo-700 mb-4">
            Reports &gt; <span className="font-medium">Compare Interviews</span>
          </p>

          {/* HEADER */}
          <h1 className="text-3xl font-bold text-indigo-900">
            Compare Interviews
          </h1>
          <p className="text-indigo-700 mt-2 mb-8 max-w-2xl">
            See your progress by comparing your previous and recent interviews.
          </p>

          {/* COMPARE BUTTON */}
          <div className="mb-10">
            <button className="bg-white px-5 py-2 rounded-full shadow text-indigo-700 font-medium">
              Compare With: <span className="ml-2">Previous Report</span>
            </button>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ReportCard report={previousReport} buttonText="View Previous Report" />
            <ReportCard report={recentReport} buttonText="View Recent Report" highlight />
          </div>

          {/* PROGRESS HIGHLIGHTS */}
          <div className="mt-14 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4">
              Progress Highlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <Highlight text="Improved technical knowledge" />
              <Highlight text="Clearer communication with examples" />
              <Highlight text="Slight increase in confidence" />
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="mt-6 bg-white rounded-2xl shadow p-6 mb-16">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4">
              Suggestions for Continued Growth
            </h2>

            <ul className="list-disc ml-6 text-indigo-700 space-y-2 text-sm">
              <li>Broaden into system design principles</li>
              <li>Practice explaining database design clearly</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function ReportCard({ report, buttonText, highlight }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl p-6 shadow-lg ${
        highlight ? "bg-indigo-50" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-14 w-14 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-800">
          {report.name[0]}
        </div>

        <div>
          <h3 className="font-semibold text-indigo-900">{report.name}</h3>
          <p className="text-sm text-indigo-600">{report.role}</p>
        </div>
      </div>

      <div className="text-sm text-indigo-600 flex gap-6 mb-6">
        <span>{report.date}</span>
        <span>{report.duration}</span>
      </div>

      {/* OVERALL SCORE */}
      <div className="mb-6">
        <p className="font-medium text-indigo-800 mb-2">
          Overall Score: {report.overall} / 10
        </p>

        <div className="flex items-center justify-center">
          <div className="h-28 w-28 rounded-full border-[10px] border-indigo-300 flex items-center justify-center text-3xl font-bold text-indigo-800">
            {report.overall}
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <Metric label="Accuracy" value={report.accuracy} />
        <Metric label="Communication" value={report.communication} />
        <Metric label="Confidence" value={report.confidence} />
      </div>

      {/* TAKEAWAY */}
      <div className="mb-6">
        <p className="font-semibold text-indigo-800 mb-2">Key Takeaway</p>
        <p className="text-sm text-indigo-600">{report.takeaway}</p>
      </div>

      {/* BUTTON */}
      <button className="w-full mt-4 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-full flex items-center justify-center gap-2">
        {buttonText}
        <FaArrowRight />
      </button>
    </motion.div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="h-16 w-16 mx-auto rounded-full border-4 border-indigo-300 flex items-center justify-center font-semibold text-indigo-800">
        {value}
      </div>
      <p className="mt-2 text-xs text-indigo-600">{label}</p>
    </div>
  );
}

function Highlight({ text }) {
  return (
    <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
      <span className="h-3 w-3 rounded-full bg-indigo-500" />
      <p className="text-indigo-700">{text}</p>
    </div>
  );
}
