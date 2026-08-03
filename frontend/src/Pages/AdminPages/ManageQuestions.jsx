import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoginNavbar from "../../Components/LoginNavbar";
import { api } from "../../services/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

/* ================= ADD MODAL ================= */
function AddQuestionModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    questionText: "",
    jobRole: "JAVA",
    difficulty: "EASY",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.questionText.trim()) {
      alert("Question text is required");
      return;
    }

    try {
      setSaving(true);
      await api.post("/admin/questions", form);
      onSave();
      onClose();
    } catch (err) {
      alert("Failed to add question");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add New Question
        </h2>

        <div className="space-y-4">
          <textarea
            name="questionText"
            value={form.questionText}
            onChange={handleChange}
            placeholder="Enter question"
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="jobRole"
            value={form.jobRole}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="JAVA">Java</option>
            <option value="PYTHON">Python</option>
            <option value="REACT">React</option>
          </select>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Question"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= EDIT MODAL ================= */
function EditQuestionModal({ question, onClose, onSave }) {
  const [form, setForm] = useState({ ...question });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await api.put(`/admin/questions/${form.id}`, form);
      onSave();
      onClose();
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Edit Question
        </h2>

        <div className="space-y-4">
          <input
            value={form.id}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />

          <textarea
            name="questionText"
            value={form.questionText}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="jobRole"
            value={form.jobRole}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="JAVA">Java</option>
            <option value="PYTHON">Python</option>
            <option value="REACT">React</option>
          </select>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [editQuestion, setEditQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/questions", {
        params: { page, size },
      });
      setQuestions(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await api.delete(`/admin/questions/${id}`);
    fetchQuestions();
  };

  return (
    <>
      <LoginNavbar />

      <div className="max-w-7xl mx-auto px-6 py-6 mt-20 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Manage Questions
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add Question
          </button>
        </div>

        {/* TABLE */}
        <motion.div className="bg-gray-50 border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="border-t">
                    <td className="px-4 py-3">{q.id}</td>
                    <td className="px-4 py-3">{q.jobRole}</td>
                    <td className="px-4 py-3">{q.difficulty}</td>
                    <td className="px-4 py-3">{q.questionText}</td>
                    <td className="px-4 py-3 text-center space-x-3">
                      <button
                        onClick={() => setEditQuestion(q)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="text-red-600"
                      >
                        <FaTrash />
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

      {/* MODALS */}
      {editQuestion && (
        <EditQuestionModal
          question={editQuestion}
          onClose={() => setEditQuestion(null)}
          onSave={fetchQuestions}
        />
      )}

      {showAddModal && (
        <AddQuestionModal
          onClose={() => setShowAddModal(false)}
          onSave={fetchQuestions}
        />
      )}
    </>
  );
}
