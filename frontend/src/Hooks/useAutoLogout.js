import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../Utils/auth";
import { toast } from "react-toastify";

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("tokenExpiry");

      if (expiry && Date.now() > parseInt(expiry, 10)) {
        clearInterval(interval); // stop further checks
        logout();
        toast.warning("Session expired. Please login again.");
        navigate("/login", { replace: true });
      }
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [navigate]);
}
