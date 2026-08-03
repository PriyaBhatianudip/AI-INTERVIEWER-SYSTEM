import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  FaClipboardList,
  FaFileExcel,
  FaChartBar,
  FaUsers,
  FaQuestionCircle,
  FaHourglassHalf,
} from "react-icons/fa";

/* ================= GREETING ================= */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
    <div className="text-3xl text-indigo-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => {
        setDashboard(res.data);
        if (res.data?.adminName) {
          setAdminName(res.data.adminName);
        }
      })
      .catch((err) =>
        console.error("Dashboard load failed", err)
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 pt-32">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          {getGreeting()}, {adminName} 👋
        </p>
      </motion.div>

      {/* ================= KPI CARDS (BACKEND ALIGNED) ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          title="Total Questions"
          value={dashboard?.stats?.totalQuestions ?? 0}
          icon={<FaQuestionCircle />}
        />
        <StatCard
          title="Active Interviews"
          value={dashboard?.stats?.activeInterviews ?? 0}
          icon={<FaClipboardList />}
        />
        <StatCard
          title="Registered Candidates"
          value={dashboard?.stats?.registeredCandidates ?? 0}
          icon={<FaUsers />}
        />
        <StatCard
          title="Pending Reviews"
          value={dashboard?.stats?.pendingReviews ?? 0}
          icon={<FaHourglassHalf />}
        />
      </section>

      {/* ================= ACTION CARDS (PREVIOUS – KEPT) ================= */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <ActionCard
          icon={<FaClipboardList />}
          title="Manage Questions"
          desc="View & organize interview questions"
          onClick={() => navigate("/admin/manage-questions")}
        />
        <ActionCard
          icon={<FaFileExcel />}
          title="Bulk Upload"
          desc="Import questions from Excel"
          onClick={() => navigate("/admin/bulk-upload")}
        />
        <ActionCard
          icon={<FaChartBar />}
          title="Interview Reports"
          desc="View detailed interview analytics"
          onClick={() => navigate("/admin/reports")}
        />
      </section>

      {/* ================= RECENT ACTIVITY ================= */}
      <section className="bg-white rounded-2xl shadow p-6 mt-10">
        <h3 className="text-lg font-semibold mb-4">
          Recent Activity
        </h3>

        {dashboard?.recentActivity?.length ? (
          <ul className="space-y-3">
            {dashboard.recentActivity.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600"
              >
                • {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">
            No recent activity
          </p>
        )}
      </section>

    </div>
  );
}

/* ================= ACTION CARD ================= */
function ActionCard({ icon, title, desc, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow p-6 cursor-pointer"
    >
      <div className="text-3xl text-indigo-500 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        {desc}
      </p>
    </motion.div>
  );
}
