import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateEvent({ darkMode }) {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);

  // Glassmorphism Styles
  const cardClass = `w-full max-w-2xl p-8 rounded-3xl shadow-2xl transition-all border backdrop-blur-xl ${darkMode
    ? "bg-slate-900/60 border-slate-700 text-slate-100"
    : "bg-white/60 border-white/50 text-slate-800"
    }`;

  const inputClass = `w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode
    ? "bg-black/40 border-slate-600 text-white placeholder-slate-400"
    : "bg-white/60 border-gray-200 text-slate-800 placeholder-slate-500"
    }`;

  // -----------------------------
  // Auto-Fill Current Location
  // -----------------------------
  const autofillLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setLocation(coords);
        toast.success("📍 Location added");
      },
      (err) => {
        console.error(err);
        toast.error("Location permission denied");
      }
    );
  };

  // -----------------------------
  // Create Event API Call
  // -----------------------------
  const createEvent = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Event title is required");

    setLoading(true);

    try {
      const res = await fetch(
        `${backendURL}/api/groups/${groupId}/events`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            date,
            time,
            location,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Event Created Successfully!");

        // 🔥 Immediately navigate to MyEvents page
        setTimeout(() => {
          navigate("/myevents");
        }, 700);
      } else {
        toast.error(data.message || "Failed to create event");
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
          Create New Event 🎉
        </h1>

        <form onSubmit={createEvent} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Event Title</label>
            <input
              type="text"
              placeholder="E.g., Movie Night, Beach Trip..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Description</label>
            <textarea
              placeholder="Add some notes about the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-[120px]`}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">
              Location (Optional)
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter exact location or coordinates"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />

              <button
                type="button"
                onClick={autofillLocation}
                className="px-4 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 bg-blue-600"
                title="Use Current Location"
              >
                📍
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] ${loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600"
              }`}
          >
            {loading ? "Creating..." : "Create Event 🚀"}
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
