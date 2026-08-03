import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import {
  MdLogout,
  MdPerson,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import useAutoLogout from "../Hooks/useAutoLogout";

/* ================= ROLE BASED NAV LINKS ================= */
const NAV_LINKS = {
  admin: [
    { name: "Dashboard", path: "/admin" },
    { name: "Manage Questions", path: "/admin/manage-questions" },
    { name: "Interview Reports", path: "/admin/interview-reports" },
  ],
  user: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Interview", path: "/interview" },
    { name: "Reports", path: "/compare" },
  ],
};

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?background=4f46e5&color=fff&name=";

/* ================= ANIMATION CONFIG ================= */
const navAnim = {
  initial: { y: -60, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const dropdownAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const mobileMenuAnim = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export default function LoginNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, role, loading, logout } = useAuth();

  // 🔴 CRITICAL FIX: wait for auth resolution
  if (loading) {
    return null; // or spinner
  }

  const safeUser = user ?? { name: "User" };
  const safeRole = role; // already normalized in AuthContext

  const links = NAV_LINKS[safeRole] ?? NAV_LINKS.user;

  useAutoLogout();

  /* ================= CLOSE MOBILE MENU ON ROUTE CHANGE ================= */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ================= CLOSE PROFILE (OUTSIDE CLICK + ESC) ================= */
  useEffect(() => {
    const closeOnOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    const closeOnEsc = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEsc);

    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const avatar =
    safeUser.profileImage ||
    `${FALLBACK_AVATAR}${encodeURIComponent(safeUser.name)}`;

  return (
    <motion.nav
      {...navAnim}
      className="fixed top-0 left-0 z-50 w-full bg-indigo-600 shadow-md"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <h1
          onClick={() =>
            navigate(safeRole === "admin" ? "/admin" : "/dashboard")
          }
          className="cursor-pointer text-2xl font-bold text-white"
        >
          AI Interviewer
        </h1>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden md:flex items-center gap-8 text-white">
          {links.map(({ name, path }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `relative font-medium ${
                  isActive
                    ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
                    : "hover:text-gray-200"
                }`
              }
            >
              {name}
            </NavLink>
          ))}

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2"
            >
              <img
                src={avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full border-2 border-white"
              />
              <MdOutlineKeyboardArrowDown
                className={`transition ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  variants={dropdownAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-56 rounded-xl bg-white text-black shadow-xl"
                >
                  <div className="border-b px-4 py-3">
                    <p className="font-semibold">{safeUser.name}</p>
                    <p className="text-xs capitalize text-gray-500">
                      {safeRole}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/profile")}
                    className="flex w-full items-center gap-2 px-4 py-3 hover:bg-gray-100"
                  >
                    <MdPerson /> Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <MdLogout /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="md:hidden text-white"
        >
          {mobileOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-indigo-600 px-6 pb-6 text-white md:hidden"
          >
            <ul className="mt-4 space-y-4">
              {links.map(({ name, path }) => (
                <li key={path}>
                  <NavLink to={path}>{name}</NavLink>
                </li>
              ))}
            </ul>

            <button
              onClick={handleLogout}
              className="mt-6 flex items-center gap-2 text-red-300"
            >
              <MdLogout /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
