import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = ["/", "/login", "/register"];

  return (
    <nav className="fixed top-0 w-full z-50 bg-indigo-600 px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center text-white">

        {/* Logo */}
        <h1 className="text-2xl font-bold transition-transform duration-300 hover:scale-105 cursor-pointer">
          AI Interviewer
        </h1>

        {/* ================= DESKTOP LINKS ================= */}
        <div className="hidden md:flex gap-6 text-lg">
          {links.map((path, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `relative group transition-all duration-300
                 ${isActive ? "text-gray-200" : "text-white"}
                 hover:text-gray-300 hover:scale-105`
              }
            >
              {path === "/" ? "Home" : path.replace("/", "").toUpperCase()}

              {/* Underline animation */}
              <motion.span
                layout
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="absolute left-0 -bottom-1 h-[2px] bg-white"
              />
            </NavLink>
          ))}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="md:hidden mt-4 flex flex-col gap-4 text-white"
          >
            {links.map((path, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250, damping: 250 }}
              >
                <NavLink
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-gray-300"
                >
                  {path === "/" ? "Home" : path.replace("/", "").toUpperCase()}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
