import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ================= PUBLIC ================= */
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

/* ================= USER ================= */
import Dashboard from "./Pages/Dashboard";
import InterviewDashboard from "./Pages/InterviewDashboard";
import CompairInterview from "./Pages/CompairInterview";
import Reports from "./Pages/Reports";
import InterviewReport from "./Pages/InterviewReport";
import Profile from "./Pages/Profile";
import StartInterview from "./Pages/StartInterview";
import ProgressPage from "./Pages/ProgressPage";

/* ================= ADMIN ================= */
import AdminDashboard from "./Pages/AdminPages/AdminDashboard";
import ManageQuestions from "./Pages/AdminPages/ManageQuestions";
import BulkUploadQuestions from "./Pages/AdminPages/BulkUploadQuestions";
import AdminInterviewReports from "./Pages/AdminPages/AdminInterviewReports";

/* ================= LAYOUTS ================= */
import HomeNavbar from "./Components/HomeNavbar";
import DashboardLayout from "./Components/DashboardLayout";
import AdminLayout from "./Components/AdminLayout";

/* ================= GUARDS ================= */
import AuthGuard from "./Components/AuthGuard";
import AdminGuard from "./Components/AdminGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route
          path="/"
          element={
            <>
              <HomeNavbar />
              <Home />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <HomeNavbar />
              <Login />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <HomeNavbar />
              <Register />
            </>
          }
        />

        {/* ================= USER ================= */}
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/interview" element={<InterviewDashboard />} />
          <Route path="/compare" element={<CompairInterview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:interviewId" element={<InterviewReport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/start-interview" element={<StartInterview />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-questions" element={<ManageQuestions />} />
          <Route path="/admin/bulk-upload" element={<BulkUploadQuestions />} />

          {/* ✅ ADMIN REPORTS (FINAL PATH) */}
          <Route
            path="/admin/reports"
            element={<AdminInterviewReports />}
          />

          {/* ✅ ADMIN REPORT DETAILS */}
          <Route
            path="/admin/reports/:interviewId"
            element={<InterviewReport />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
