import { createContext, useContext, useEffect, useState } from "react";
import {
  loginApi,
  logout,
  getUser,
  getUserRole,
  isAuthenticated,
} from "../Utils/auth";
import { api } from "../services/api";

const AuthContext = createContext(null);
const normalizeRole = (role) => {
  if (!role) return null;
  if (role.startsWith("ROLE_")) {
    return role.replace("ROLE_", "").toLowerCase();
  }
  return role.toLowerCase();
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ON REFRESH ================= */
  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    const storedUser = getUser();

    if (storedUser?.id) {
      setUser(storedUser);
      setRole(normalizeRole(getUserRole()));

      setAuthenticated(true);
      setLoading(false);
    } else {
      // fallback: fetch from backend if needed
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
          setRole(normalizeRole(res.data.role));

          setAuthenticated(true);
        })
        .catch(() => {
          logout();
          setUser(null);
          setRole(null);
          setAuthenticated(false);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email, password, roleIntent) => {
    const loggedInUser = await loginApi(email, password, roleIntent);
    setUser(loggedInUser);
    setRole(normalizeRole(loggedInUser.role));

    setAuthenticated(true);
  };

  /* ================= LOGOUT ================= */
  const logoutUser = () => {
    logout();
    setUser(null);
    setRole(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        authenticated,
        loading,
        login,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
