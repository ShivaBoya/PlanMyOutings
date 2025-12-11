import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateGroup({ darkMode, user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // Glassmorphism Styles
  const cardClass = `w-full max-w-2xl p-8 rounded-3xl shadow-2xl transition-all border backdrop-blur-xl ${darkMode
    ? "bg-slate-900/60 border-slate-700 text-slate-100"
    : "bg-white/60 border-white/50 text-slate-800"
    }`;

  const inputClass = `w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode
    ? "bg-black/40 border-slate-600 text-white placeholder-slate-400"
    : "bg-white/60 border-gray-200 text-slate-800 placeholder-slate-500"
    }`;

  // ===============================
  // CREATE GROUP FUNCTION
  // ===============================
  const createGroup = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendURL}/api/groups`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Group Created Successfully");

        // ➤ Redirect user back to MyTrip with refresh state
        setTimeout(() => {
          navigate("/mytrip", { state: { refresh: true } });
        }, 900);
      } else {
        toast.error(data.message || "Failed to create group");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen flex justify-center px-4 animate-fade-in relative z-10">
      <div className={cardClass}>
        <h1 className="text-4xl font-black text-center mb-8 tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Create a Group
        </h1>

        {/* ===============================
            FORM START
        =============================== */}
        <form onSubmit={createGroup} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">
              Group Name
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Summer Goa Trip 🌴"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">
              Description
            </label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              placeholder="What's this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] ${loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600"
              }`}
          >
            {loading ? "Creating Group..." : "Create Group 🚀"}
          </button>
        </form>

        {/* Illustration */}
        <div className="mt-8 flex justify-center opacity-60">
          {/* Simple decorative element */}
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
