import { useState, useRef } from "react";
import { motion } from "framer-motion";
import LoginNavbar from "../../Components/LoginNavbar";
import { api } from "../../services/api";
import { FaUpload, FaDownload, FaFileExcel } from "react-icons/fa";
import { getUser } from "../../Utils/auth";

export default function BulkUploadQuestions() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const adminId = getUser()?.id;

  const fileInputRef = useRef(null);

  /* ================= FILE SELECT ================= */
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    // Auto upload after selection
    await uploadFile(selectedFile);
  };

  /* ================= DOWNLOAD TEMPLATE ================= */
  const downloadTemplate = async () => {
    const res = await api.get("/admin/bulk-upload/template", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "question_bulk_upload_template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  /* ================= UPLOAD ================= */
  const uploadFile = async (selectedFile) => {
    if (!selectedFile) {
      alert("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("adminId", adminId);

    try {
      setUploading(true);
      const res = await api.post(
        "/admin/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(res.data);
    } catch (err) {
      alert("Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DOWNLOAD ERROR LOG ================= */
  const downloadErrors = async () => {
    const res = await api.get(
      `/admin/bulk-upload/${result.uploadId}/errors`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      "bulk_upload_errors.xlsx"
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <LoginNavbar />

      <div className="max-w-5xl mx-auto px-6 py-6 mt-20 space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">
            Bulk Upload Questions
          </h1>
          <p className="text-gray-500 text-sm">
            Upload multiple interview questions using Excel
          </p>
        </motion.div>

        {/* TEMPLATE */}
        <div className="flex gap-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 border px-4 py-2 rounded"
          >
            <FaDownload /> Download Template
          </button>
        </div>

        {/* UPLOAD BOX */}
        <div className="bg-white border rounded-xl p-6 space-y-4">

          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <FaUpload />
            {uploading ? "Uploading..." : "Upload Excel File"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 border rounded-xl p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold">
              Upload Summary
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Rows: {result.totalRows}</div>
              <div>Success: {result.successCount}</div>
              <div>Failed: {result.failureCount}</div>
            </div>

            {result.failureCount > 0 && (
              <button
                onClick={downloadErrors}
                className="flex items-center gap-2 text-red-600"
              >
                <FaFileExcel /> Download Error Log
              </button>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
