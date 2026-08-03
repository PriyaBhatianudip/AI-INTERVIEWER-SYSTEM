import axios from "axios";

const API_URL = "http://localhost:8080/interview/api";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const ROLE_KEY = "role";

/* ================= LOGIN ================= */
export const loginApi = async (email, password, roleIntent) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
    role: roleIntent,
  });

  const user = {
    id: res.data.id,
    name: res.data.name,
    email: res.data.email,
    role: res.data.role,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ROLE_KEY, user.role);

  // Optional token (only if backend sends it)
  if (res.data.token) {
    localStorage.setItem(TOKEN_KEY, res.data.token);
  }

  return user;
};

/* ================= TOKEN ================= */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/* ================= LOGOUT ================= */
export const logout = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

/* ================= HELPERS ================= */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(USER_KEY);
};

/* ================= UPDATE USER (🔥 FIXED) ================= */
export const updateUser = (updatedUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
};
