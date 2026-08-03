import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({ children }) {
  const { authenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-500">
        Checking admin access...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 FIX: normalize role comparison
  if (role?.toLowerCase() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
