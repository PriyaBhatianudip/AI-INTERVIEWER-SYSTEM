import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Briefcase,
  Code,
  Users,
  ArrowLeft,
  Cpu,
} from "lucide-react";

/* ================= DATA ================= */
const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Technical Interview",
    domain: "IT & Engineering",
    icon: <Code size={28} />,
    color: "from-indigo-500 to-purple-500",
    technologies: ["Java", "Python", "Spring Boot", "React"],
  },
  {
    id: "hr",
    label: "HR Interview",
    domain: "Human Resources",
    icon: <Users size={28} />,
    color: "from-green-500 to-emerald-500",
    technologies: ["General HR"],
  },
  {
    id: "managerial",
    label: "Managerial Interview",
    domain: "Leadership",
    icon: <Briefcase size={28} />,
    color: "from-orange-500 to-red-500",
    technologies: ["People Management", "Project Handling"],
  },
];

/* ================= COMPONENT ================= */
export default function PracticeModePopup({ open, onClose, onSelect }) {
  const [selectedType, setSelectedType] = useState(null);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-[92%] max-w-lg p-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* HEADER */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-indigo-900">
              Practice Mode
            </h2>
            <p className="text-sm text-gray-500">
              {selectedType
                ? "Choose your technology"
                : "Choose interview type"}
            </p>
          </div>

          {/* STEP 1 – INTERVIEW TYPE */}
          {!selectedType && (
            <div className="grid gap-4">
              {INTERVIEW_TYPES.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedType(item)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-white bg-gradient-to-r ${item.color} shadow`}
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    {item.icon}
                  </div>

                  <div className="text-left">
                    <p className="font-semibold text-lg">
                      {item.label}
                    </p>
                    <p className="text-sm opacity-90">
                      {item.domain}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* STEP 2 – TECHNOLOGY */}
          {selectedType && (
            <div>
              <button
                onClick={() => setSelectedType(null)}
                className="flex items-center gap-2 text-sm text-indigo-600 mb-4 hover:underline"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="grid gap-3">
                {selectedType.technologies.map((tech) => (
                  <motion.button
                    key={tech}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onSelect({
                        interviewType: selectedType.label,
                        domain: selectedType.domain,
                        technology: tech,
                      });
                      setSelectedType(null);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 border rounded-xl hover:bg-indigo-50"
                  >
                    <Cpu size={18} className="text-indigo-600" />
                    <span className="font-medium">{tech}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
