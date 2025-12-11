import React, { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

export default function Settings({ darkMode, user }) {
  const userId = user?._id;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
  });

  const [availability, setAvailability] = useState([]);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://backend-1-7bt9.onrender.com/User/${userId}`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setProfile({
            name: data.name || "",
            email: data.email || "",
            location: data.location || "",
          });
        } else {
          toast.error(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching profile");
      }
    };

    const fetchAvailability = async () => {
      try {
        const res = await fetch(`https://backend-1-7bt9.onrender.com/${userId}/availability`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setAvailability(data);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    fetchProfile();
    fetchAvailability();
  }, [userId]);

  // Handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (index, value) => {
    const updated = [...availability];
    updated[index] = value;
    setAvailability(updated);
  };

  const addAvailability = () => setAvailability([...availability, ""]);
  const removeAvailability = (index) =>
    setAvailability(availability.filter((_, i) => i !== index));

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email || !profile.location) {
      toast.warning("Please fill out all profile fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://backend-1-7bt9.onrender.com/UpdateUser/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...profile, availability }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.warning("Please fill out all password fields!");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const bgColor = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";

  return (
    <div className={`${bgColor} min-h-screen transition-colors duration-500 py-32 px-6 md:px-12`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-gray-400 text-lg">Manage your profile and security preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.03, rotateX: 3, rotateY: 3 }}
          className={`p-8 rounded-3xl shadow-2xl ${cardBg} border border-gray-300 dark:border-gray-700 transition-transform duration-300`}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-6 h-6" /> Profile Settings
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Email"
              disabled
            />
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Location"
            />

            {/* Availability */}
            <div className="mt-4 space-y-2">
              <label className="font-medium">Availability</label>
              {availability.map((slot, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => handleAvailabilityChange(index, e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-cyan-500 transition"
                  />
                  <button
                    onClick={() => removeAvailability(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addAvailability}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
              >
                Add Availability
              </button>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="mt-3 w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save Profile"}
            </button>
          </div>
        </motion.div>

        {/* Password Card */}
        <motion.div
          whileHover={{ scale: 1.03, rotateX: -3, rotateY: -3 }}
          className={`p-8 rounded-3xl shadow-2xl ${cardBg} border border-gray-300 dark:border-gray-700 transition-transform duration-300`}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6" /> Change Password
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
              placeholder="Current Password"
            />
            <input
              type="password"
              name="newPass"
              value={passwords.newPass}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
              placeholder="New Password"
            />
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
              placeholder="Confirm New Password"
            />

            <button
              onClick={handlePasswordChange}
              className="mt-3 w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-teal-400 hover:to-green-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all"
            >
              🔒 Update Password
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
