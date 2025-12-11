import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function MyEvents({ darkMode }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Glassmorphism Styles
  const cardClass = `p-6 rounded-3xl shadow-xl transition-all border backdrop-blur-md ${darkMode
    ? "bg-slate-900/60 border-slate-700 text-slate-100"
    : "bg-white/60 border-white/50 text-slate-800"
    }`;

  // Fetch user's events
  const loadEvents = async () => {
    try {
      const res = await fetch(`${backendURL}/api/myevents`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Could not load events");
        setEvents([]);
        return;
      }

      // SAFETY CHECK: Ensure we always set an array
      if (!Array.isArray(data)) {
        console.warn("⚠ Backend did NOT return an array:", data);
        setEvents([]);
        return;
      }

      setEvents(data);
    } catch (err) {
      toast.error("Network error");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter Logic
  const today = new Date();

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
      if (!event.date) return true;

      const eventDate = new Date(event.date);

      if (filter === "upcoming") return eventDate >= today;
      if (filter === "past") return eventDate < today;
      return true;
    })
    : [];

  return (
    <div className="pt-28 px-6 pb-20 min-h-screen animate-fade-in relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent inline-block">
          📅 My Events
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          {["all", "upcoming", "past"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${filter === type
                ? "bg-blue-600 text-white scale-105"
                : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                }`}
            >
              {type === "all" && "All"}
              {type === "upcoming" && "Upcoming"}
              {type === "past" && "Past"}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p className="opacity-70 animate-pulse">Loading your events...</p>}

        {/* No Events */}
        {!loading && filteredEvents.length === 0 && (
          <div className={`p-8 rounded-3xl border border-dashed text-center opacity-70 ${darkMode ? "border-slate-700 bg-slate-800/30" : "border-slate-300 bg-white/40"}`}>
            <p className="text-lg">You have no events yet.</p>
          </div>
        )}

        {/* Event List */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className={cardClass}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{event.title}</h2>
                  <p className="mt-1 opacity-80 text-sm font-semibold">
                    Group: <span className="text-blue-500">{event.group?.name}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/event/${event._id}/chat`}
                    className="px-4 py-2 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  >
                    Chat 💬
                  </Link>
                  <Link
                    to={`/event/${event._id}`}
                    className="px-4 py-2 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Details ➜
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  {event.date ? new Date(event.date).toDateString() : "Date TBD"}
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  {event.time || "Time TBD"}
                </div>
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <span>📍</span>
                  <span className="truncate">{event.location || "Location TBD"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
