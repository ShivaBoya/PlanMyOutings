import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Link as LinkIcon,
  PlusCircle,
  MessageCircle,
  ArrowRight
} from "lucide-react";

export default function GroupDetails({ darkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState("");

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // Colors
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const mutedColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardClass = `rounded-3xl border shadow-xl backdrop-blur-xl transition-all ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-white/50"
    }`;

  // ============================
  // LOAD DATA
  // ============================
  useEffect(() => {
    loadGroup();
    loadEvents();
  }, [id]);

  const loadGroup = async () => {
    try {
      const res = await fetch(`${backendURL}/api/groups/${id}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        return navigate("/login");
      }

      if (res.ok) setGroup(data);
      else toast.error(data.message || "Failed to load group");
    } catch (err) {
      toast.error("Network error");
    }
  };

  const loadEvents = async () => {
    try {
      const res = await fetch(`${backendURL}/api/groups/${id}/events`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 401) return; // Already handled by loadGroup redirect or will fail silently to avoid double toast

      if (res.ok) setEvents(data);
    } catch (err) {
      toast.error("Error loading events");
    }
    setLoading(false);
  };

  const generateInvite = async () => {
    try {
      const res = await fetch(`${backendURL}/api/groups/${id}/invite`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setInviteLink(data.inviteLink);
        navigator.clipboard.writeText(data.inviteLink);
        toast.success("Invite link copied!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error generating invite");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!group) return <p className="pt-24 text-center">Group not found</p>;

  return (
    <div className={`min-h-screen pt-20 px-4 pb-24 ${textColor} animate-fade-in`}>
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? "bg-purple-900" : "bg-purple-200"
            }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? "bg-blue-900" : "bg-blue-200"
            }`}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            {group.name}
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${mutedColor}`}>
            {group.description || "The best group for planning outings together!"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - INFO & MEMBERS */}
          <div className="space-y-6">
            {/* ACTIONS CARD */}
            <div className={`${cardClass} p-6`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/group/${id}/create-event`)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg shadow-green-500/30 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <PlusCircle size={20} /> Create New Event
                </button>

                <button
                  onClick={generateInvite}
                  className="w-full py-3 px-4 rounded-xl font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors flex items-center justify-center gap-2"
                >
                  <LinkIcon size={20} />
                  {inviteLink ? "Copied!" : "Invite Friends"}
                </button>
              </div>
            </div>

            {/* MEMBERS CARD */}
            <div className={`${cardClass} p-6`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="text-purple-500" /> Members ({group.members?.length})
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {group.members?.map((m) => (
                  <div key={m.user._id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {m.user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{m.user.name}</p>
                      <p className="text-xs opacity-60">{m.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - EVENTS GRID */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <span className="text-sm font-semibold opacity-60">{events.length} events</span>
            </div>

            {events.length === 0 ? (
              <div className={`${cardClass} p-12 text-center flex flex-col items-center justify-center opacity-60`}>
                <Calendar size={64} className="mb-4 text-blue-300 dark:text-blue-800" />
                <p className="text-xl font-bold">No events yet</p>
                <p>Create one to get the party started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div key={ev._id} className={`${cardClass} p-5 hover:border-blue-500 transition-colors group relative overflow-hidden`}>
                    <h3 className="text-xl font-bold mb-1">{ev.title}</h3>
                    <p className="text-sm opacity-70 line-clamp-2 min-h-[40px] mb-4">
                      {ev.description || "No description provided."}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm opacity-80">
                        <Calendar size={14} className="text-blue-500" /> {ev.date ? new Date(ev.date).toLocaleDateString() : "TBD"}
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-80">
                        <MapPin size={14} className="text-pink-500" /> {ev.location || "TBD"}
                      </div>
                    </div>

                    <div className="flex gap-2 relative z-10">
                      <button
                        onClick={() => navigate(`/event/${ev._id}`)}
                        className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => navigate(`/event/${ev._id}/chat`)}
                        className="w-10 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 hover:bg-purple-200 transition-colors"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

