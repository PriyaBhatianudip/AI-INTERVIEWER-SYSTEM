import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRoute() {
  const { role } = useAuth();

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
