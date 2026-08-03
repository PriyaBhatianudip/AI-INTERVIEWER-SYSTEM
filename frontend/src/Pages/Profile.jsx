import { useState } from "react";
import { motion } from "framer-motion";
import { getUser, updateUser, getUserRole, logout } from "../Utils/auth";

export default function Profile() {
  const role = getUserRole();
  const user = getUser();

  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.profileImage || null);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      updateUser({ profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = () => {
    updateUser({ name });
    alert("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-5 sm:p-8">

        {/* HEADER */}
        <h1 className="text-xl sm:text-2xl font-bold mb-6">My Profile</h1>

        {/* PROFILE SECTION */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* AVATAR */}
          <div className="relative">
            <img
              src={
                image ||
                "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
              }
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500"
            />

            {/* ROLE BADGE */}
            <span
              className={`absolute bottom-1 right-1 px-2 py-0.5 text-xs rounded-full text-white ${
                role === "admin" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {role}
            </span>
          </div>

          {/* UPLOAD */}
          <div className="text-center sm:text-left">
            <label className="cursor-pointer text-indigo-600 text-sm font-medium">
              Change profile photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EMAIL (READ ONLY) */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={user?.email || "not set"}
              disabled
              className="w-full mt-1 p-2.5 border rounded-lg bg-gray-100 text-gray-500"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm text-gray-600">Account Status</label>
            <div className="mt-2 inline-flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              Online
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <button className="block mt-2 text-indigo-600 text-sm hover:underline">
              Change password
            </button>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </motion.button>

          <button
            onClick={logout}
            className="flex-1 border border-red-500 text-red-500 py-2.5 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        {/* DANGER ZONE */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-sm font-semibold text-red-600 mb-2">
            Danger Zone
          </h2>
          <button className="text-sm text-red-500 hover:underline">
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
