import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import interviewerImg from "../assets/Interview-pana.svg";
import { useAuth } from "../context/AuthContext";

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  const { user } = useAuth();

  // ✅ SAME PATTERN AS ADMIN DASHBOARD
  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="min-h-screen bg-[#f6f9ff]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white overflow-hidden">

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Welcome back,{" "}
              <span className="text-orange-300">{userName}</span> 👋
            </h1>

            <p className="mt-4 text-lg text-indigo-100 max-w-md">
              Practice interviews with real-time AI feedback and improve faster.
            </p>

            <button
              onClick={() => navigate("/interview")}
              className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl transition-transform hover:scale-105"
            >
              🚀 Start Practice
            </button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <img
              src={interviewerImg}
              alt="Interview Illustration"
              className="w-full max-w-lg mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="-mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Start Interview",
              desc: "Practice with AI",
              icon: "🎤",
              color: "from-orange-400 to-pink-500",
              action: () => navigate("/interview"),
            },
            {
              title: "Last Report",
              desc: "View feedback",
              icon: "📊",
              color: "from-indigo-400 to-purple-500",
              action: () => navigate("/reports"),
            },
            {
              title: "Progress",
              desc: "Track improvement",
              icon: "📈",
              color: "from-green-400 to-emerald-500",
              action: () => navigate("/progress"),
            },
            {
              title: "Weak Areas",
              desc: "Improve skills",
              icon: "🎯",
              color: "from-red-400 to-orange-500",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-6 shadow-xl cursor-pointer`}
              onClick={item.action}
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
              <p className="text-sm opacity-90">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PROGRESS SNAPSHOT ================= */}
      <section className="mt-24 max-w-7xl mx-auto px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Progress Snapshot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Interviews Taken" value="12" />
          <StatCard label="Average Score" value="78%" />
          <StatCard label="Strongest Skill" value="Communication" />
        </div>
      </section>

      {/* ================= RESUME INTERVIEW ================= */}
      <section className="mt-16 max-w-7xl mx-auto px-8">
        <div className="bg-indigo-50 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Continue where you left off
            </h3>
            <p className="text-gray-600 mt-1">
              Java Technical Interview – Question 3
            </p>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full">
            Resume Interview
          </button>
        </div>
      </section>

      {/* ================= AI TIP ================= */}
      <section className="mt-16 max-w-7xl mx-auto px-8 pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-lg font-semibold">🤖 AI Tip for You</h3>
          <p className="mt-2 text-sm opacity-90">
            Use the STAR method (Situation, Task, Action, Result) to improve
            relevance and clarity in your answers.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= HELPER ================= */
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
}
