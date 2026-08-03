import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function StartInterview() {
  const navigate = useNavigate();

  const [jdFile, setJdFile] = useState(null);
  const [jobRole, setJobRole] = useState("");

  const uploadJD = async () => {
    const formData = new FormData();
    formData.append("jd", jdFile);

    const res = await api.post("/jd/analyze", formData);

    navigate("/interview", {
      state: { jdAnalysis: res.data }
    });
  };

  const startWithRole = async () => {
    navigate("/interview", {
      state: { jobRole }
    });
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Start Interview</h1>

      {/* JD Upload */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Upload Job Description (Optional)</h3>
        <input type="file" onChange={(e) => setJdFile(e.target.files[0])} />
        <button onClick={uploadJD} className="mt-3 btn-primary">
          Analyze JD & Start
        </button>
      </div>

      {/* OR Job Role */}
      <div>
        <h3 className="font-semibold mb-2">Or Select Job Role</h3>
        <input
          className="input"
          placeholder="Java Developer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
        <button onClick={startWithRole} className="mt-3 btn-secondary">
          Start Interview
        </button>
      </div>
    </div>
  );
}
