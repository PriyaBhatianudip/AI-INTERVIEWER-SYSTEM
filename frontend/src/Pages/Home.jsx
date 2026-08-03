import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import interviewerImg from "../assets/Interview-pana.svg";
import playIcon from "../assets/playbutton.jpeg";
import settingIcon from "../assets/setting.jpeg";
import hrIcon from "../assets/hr.jpeg";
import mockIcon from "../assets/mock.jpeg";
import reportIcon from "../assets/report.jpeg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // NEW POPUP STATE
  const [featurePopup, setFeaturePopup] = useState(null);

  const handleStartPractice = () => navigate("/login");
  const handleWatchDemo = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Update progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100 || 0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [showModal]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
  };

  const features = [
    { title: "Technical Interviews", desc: "Practice DSA, OOPs, DBMS & real coding questions", img: settingIcon },
    { title: "HR Interviews", desc: "Behavioral, situational & confidence-building questions", img: hrIcon },
    { title: "Mock Tests & Feedback", desc: "Timed tests with AI-powered instant evaluation", img: mockIcon },
    { title: "Personalized Reports", desc: "Detailed performance analysis & improvement tips", img: reportIcon },
  ];

  const steps = [
    { step: "1", title: "Choose Your Domain", desc: "Select IT, HR, Marketing & more", img: "https://cdn-icons-png.flaticon.com/512/2721/2721270.png" },
    { step: "2", title: "Answer AI Questions", desc: "Respond via text or voice", img: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" },
    { step: "3", title: "Get Instant Feedback", desc: "Receive scores & improvement tips", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  ];

  // NEW POPUP CONTENT
  const featureDetails = {
    "Technical Interviews": {
      title: "Technical Interviews",
      content: [
        "👉 Get yourself registered.",
        "👉 Sign in.",
        "👉 Try your domain interviews.",
        "👉 Get live feedback.",
        "👉 Start learning the concepts."
      ]
    },
    "HR Interviews": {
      title: "HR Interviews",
      content: [
        "Practice behavioral & situational HR questions.",
        "Learn effective communication skills.",
        "Improve clarity, tone & delivery.",
        "Prepare confidently for real HR rounds."
      ]
    },
    "Mock Tests & Feedback": {
      title: "Mock Tests & Feedback",
      content: [
        "Attempt timed interview simulations.",
        "Get AI-powered scoring instantly.",
        "Check strengths & weak areas.",
        "Use improvement tips to grow."
      ]
    },
    "Personalized Reports": {
      title: "Personalized Reports",
      content: [
        "View detailed interview performance.",
        "Understand analytics & score breakdown.",
        "Discover improvement opportunities.",
        "Track your growth over time."
      ]
    }
  };

  return (
    <div className="bg-[#f6f9ff] font-sans overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative text-white pt-40 pb-40 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700">

        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-indigo-400/30 rounded-full blur-3xl animate-[blob_20s_infinite]" />
        <div className="absolute bottom-20 right-0 w-[28rem] h-[28rem] bg-cyan-400/30 rounded-full blur-3xl animate-[blob_25s_infinite_reverse]" />

        <div className="relative w-[90%] mx-auto grid md:grid-cols-2 gap-16 items-center z-10">
          
          {/* LEFT HERO TEXT */}
          <div className="space-y-6 animate-[floatText_6s_ease-in-out_infinite]">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              AI-Powered <br />
              <span className="text-orange-300">Interviewer</span> System
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              Practice interviews with AI, get instant feedback, and crack real interviews with confidence.
            </p>
            <div className="flex gap-5 pt-6">
              <button
                onClick={handleStartPractice}
                className="bg-orange-400 hover:bg-orange-500 px-9 py-4 rounded-full font-semibold shadow-xl hover:scale-110 transition-all cursor-pointer selection-none"
              >
                🚀 Start Practice
              </button>
              <button
                onClick={handleWatchDemo}
                className="bg-white text-blue-700 px-7 py-4 rounded-full font-semibold flex items-center gap-3 shadow-xl hover:scale-110 transition-all selection-none cursor-pointer"
              >
                <img src={playIcon} alt="Play Demo" className="w-6 h-6" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* RIGHT CARD PREVIEW */}
          <div className="relative flex justify-center md:justify-end animate-[floatCard_5s_ease-in-out_infinite]">
            <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-30 blur-3xl rounded-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-4 space-y-4 w-92">

              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-3 shadow-inner">
                <div className="flex gap-2 mb-2 px-2">
                  <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  <img src={interviewerImg} alt="AI Interview Preview" className="w-full h-44 object-contain" />
                </div>
              </div>

              <div className="bg-white/90 rounded-xl p-3 shadow-md">
                <p className="text-xs font-semibold text-gray-700">🤖 AI Question</p>
                <p className="text-gray-600 text-sm pl-5 mt-1">
                  Explain the difference between REST and GraphQL.
                </p>
              </div>

              <div className="bg-white/90 rounded-xl p-3 text-sm text-gray-600 shadow-md">
                REST uses multiple endpoints while GraphQL uses a single endpoint.
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl p-3 text-sm shadow-md">
                ✅ Good answer! Mention flexible data fetching in GraphQL.
              </div>
            </div>
          </div>
        </div>

        {/* VIDEO MODAL */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="relative bg-white rounded-2xl w-[90%] md:w-[60%] lg:w-[50%] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-8 right-0 text-gray-700 text-3xl font-bold hover:text-red-500"
                onClick={handleCloseModal}
              >
                ✕
              </button>

              <video
                ref={videoRef}
                className="w-full h-auto"
                src={"/demo-video.mp4"}
                controls={false}
                autoPlay
              />

              <div className="flex items-center justify-between bg-gray-100 p-2">
                <button onClick={togglePlay} className="p-2">
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  )}
                </button>

                <div className="relative" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                  <svg className="w-6 h-6 text-blue-500 cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 10v4h4l5 5V5l-5 5H3z" />
                  </svg>
                  {showVolumeSlider && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="absolute -top-12 left-0 w-24"
                    />
                  )}
                </div>

                <div
                  className="w-full mx-4 h-2 bg-gray-300 rounded relative cursor-pointer"
                  onClick={(e) => {
                    if (videoRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newTime = (clickX / rect.width) * videoRef.current.duration;
                      videoRef.current.currentTime = newTime;
                    }
                  }}
                >
                  <div
                    className="h-2 bg-blue-500 rounded absolute top-0 left-0"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FEATURES SECTION */}
      <section className="relative -mt-48 pb-20 z-20">
        <div className="w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-7">
          {features.map((item, index) => (
            <div key={item.title} className="relative">
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 opacity-30 blur-3xl -z-10"
                animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                transition={{ duration: 6 + index, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFeaturePopup(item.title)}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateX = -(y / rect.height - 0.5) * 10;
                  const rotateY = (x / rect.width - 0.5) * 10;
                  card.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <img src={item.img} alt={item.title} className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{item.title}</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE POPUP MODAL */}
      {featurePopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setFeaturePopup(null)}
        >
          <div
            className="bg-white w-[90%] sm:w-[420px] rounded-2xl p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-gray-700 hover:text-red-500 text-2xl"
              onClick={() => setFeaturePopup(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {featureDetails[featurePopup].title}
            </h2>

            <div className="space-y-2 text-gray-700 leading-relaxed">
              {featureDetails[featurePopup].content.map((line, idx) => (
                <p key={idx} className="text-sm">• {line}</p>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm cursor-pointer"
                onClick={() => setFeaturePopup(null)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      <section className="py-12 text-center bg-[#f6f9ff]">
        <h2 className="text-4xl font-extrabold text-gray-800">How It Works</h2>
        <p className="text-gray-500 mt-3">Easy steps to ace your interview</p>

        <div className="w-[90%] mx-auto mt-20 grid md:grid-cols-3 gap-10 py-4">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              className="bg-white rounded-3xl p-10 border border-blue-100 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = -(y / rect.height - 0.5) * 10;
                const rotateY = (x / rect.width - 0.5) * 10;
                card.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
              }}
            >
              <div className="w-10 h-10 mx-auto mb-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {item.step}
              </div>
              <img src={item.img} className="w-16 mx-auto mb-6" alt={item.title} />
              <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
              <p className="text-gray-500 mt-2 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}