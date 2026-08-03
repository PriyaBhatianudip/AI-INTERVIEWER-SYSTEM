import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginNavbar from "../../Components/LoginNavbar";
import { api } from "../../services/api";

export default function AdminInterviewReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  /* ================= FETCH REPORTS ================= */
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/interview-reports", {
        params: { page, size },
      });

      setReports(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load interview reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  return (
    <>
      <LoginNavbar />

      <div className="max-w-7xl mx-auto px-6 py-6 mt-20 space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">
            Interview Reports
          </h1>
          <p className="text-gray-500 text-sm">
            View all candidate interview results
          </p>
        </motion.div>

        {/* TABLE */}
        <motion.div className="bg-gray-50 border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Candidate</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    No interview reports found
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.interviewId} className="border-t">
                    <td className="px-4 py-3">
                      {r.candidateName}
                    </td>
                    <td className="px-4 py-3">
                      {r.candidateEmail}
                    </td>
                    <td className="px-4 py-3">
                      {r.jobRole}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(r.interviewDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {r.totalScore ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          r.completed
                            ? "bg-green-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {r.completed ? "Completed" : "In Progress"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/interview-reports/${r.interviewId}`
                          )
                        }
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end gap-3 p-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
