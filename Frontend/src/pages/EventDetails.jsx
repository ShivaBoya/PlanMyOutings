import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  Edit3,
  Trash2,
  Users,
  CheckCircle,
  HelpCircle,
  XCircle,
  LayoutDashboard,
  BarChart2,
  Sparkles
} from "lucide-react";

import SuggestionsSection from "../components/SuggestionsSection";
import PollsSection from "../components/PollsSection";
import BotWidget from "../components/BotWidget";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function EventDetails({ darkMode, user }) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // State
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | polls | suggestions
  const [socket, setSocket] = useState(null);

  // RSVP State
  const [myRsvp, setMyRsvp] = useState(null);

  // Theme
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const mutedColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardClass = `rounded-3xl border shadow-xl backdrop-blur-xl transition-all ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-white/50"}`;

  useEffect(() => {
    // 1. Fetch Event
    loadEvent();

    // 2. Setup Socket
    const s = io(BACKEND, { withCredentials: true });
    setSocket(s);

    s.emit("join:event", eventId);
    if (user) s.emit("auth:user", { userId: user._id });

    return () => {
      s.disconnect();
    };
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/events/${eventId}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setEvent(data);
        fetchRsvp(); // check my RSVP
      } else {
        toast.error(data.message || "Event not found");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvp = async () => {
    // Ideally backend should return my RSVP with event or separate endpoint
    // Using the list endpoint to find mine for now (optimize later)
    try {
      const res = await fetch(`${BACKEND}/api/events/${eventId}/rsvps`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const found = data.find(r => r.user?._id === user?._id || r.user === user?._id);
        if (found) setMyRsvp(found.answer);
      }
    } catch { }
  };

  const handleRsvp = async (status) => {
    try {
      const res = await fetch(`${BACKEND}/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answer: status })
      });

      if (res.ok) {
        setMyRsvp(status);
        toast.success(`You are ${status === 'yes' ? 'going' : status === 'maybe' ? 'unsure' : 'not going'}`);
        // Optional: emit socket event to update counts live
      }
    } catch {
      toast.error("Failed to update RSVP");
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm("Delete this event? Cannot be undone.")) return;
    try {
      await fetch(`${BACKEND}/api/events/${eventId}`, {
        method: "DELETE",
        credentials: "include"
      });
      toast.success("Event deleted");
      navigate(`/group/${event.group._id}`);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Formatters
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "TBD";
  const formatTime = (t) => t ? new Date(`2000-01-01T${t}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "TBD";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!event) return <div className="pt-24 text-center">Event not found</div>;

  const isOwner = user && (event.creator?._id === user._id || event.group?.owner === user._id);

  return (
    <div className={`min-h-screen pt-20 px-4 pb-24 ${textColor} animate-fade-in`}>

      {/* 3D BACKGROUND */}
      {/* 3D BACKGROUND IS GLOBAL NOW */}

      <div className="max-w-5xl mx-auto relative z-10">

        {/* HEADER CARD */}
        <div className={`${cardClass} p-8 mb-8 relative overflow-hidden`}>
          {/* DECORATIVE GRADIENT LINE */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  {event.group?.name}
                </span>
                {isOwner && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
                    Admin
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                {event.title}
              </h1>

              <p className={`text-lg max-w-2xl ${mutedColor}`}>
                {event.description || "No description provided yet."}
              </p>

              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60 uppercase">Date</p>
                    <p className="font-semibold">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60 uppercase">Time</p>
                    <p className="font-semibold">{formatTime(event.time)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30">
                    <MapPin className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60 uppercase">Location</p>
                    <p className="font-semibold">{event.location || "TBD"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              <button
                onClick={() => navigate(`/event/${eventId}/chat`)}
                className="w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} /> Open Chat
              </button>

              {isOwner && (
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Edit3 size={18} className="mx-auto" />
                  </button>
                  <button
                    onClick={deleteEvent}
                    className="py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={18} className="mx-auto" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-4 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'polls', label: 'Polls & Votes', icon: BarChart2 },
            { id: 'suggestions', label: 'AI Suggestions', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md"
                : "bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700"
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="animate-slide-up">

          {/* TAB: OVERVIEW (RSVP) */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* RSVP CARD */}
              <div className={`${cardClass} p-6 lg:col-span-2`}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="text-blue-500" /> RSVP Status
                </h3>

                <p className={`mb-6 ${mutedColor}`}>
                  Are you joining us for <strong>{event.title}</strong>? Let the group know!
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleRsvp('yes')}
                    className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${myRsvp === 'yes'
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 shadow-md transform scale-[1.02]"
                      : "border-transparent bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <CheckCircle size={32} className={myRsvp === 'yes' ? 'fill-current' : ''} />
                    <span className="font-bold">Going</span>
                  </button>

                  <button
                    onClick={() => handleRsvp('maybe')}
                    className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${myRsvp === 'maybe'
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 shadow-md transform scale-[1.02]"
                      : "border-transparent bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <HelpCircle size={32} className={myRsvp === 'maybe' ? 'fill-current' : ''} />
                    <span className="font-bold">Maybe</span>
                  </button>

                  <button
                    onClick={() => handleRsvp('no')}
                    className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${myRsvp === 'no'
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 shadow-md transform scale-[1.02]"
                      : "border-transparent bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <XCircle size={32} className={myRsvp === 'no' ? 'fill-current' : ''} />
                    <span className="font-bold">No</span>
                  </button>
                </div>
              </div>

              {/* INFO (TODO: Replace with Map) */}
              <div className={`${cardClass} p-6 flex flex-col justify-center items-center`}>
                <div className="text-center opacity-60 mb-4">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Dynamic Map Integration</p>
                </div>
                <button className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 font-semibold">
                  Get Directions
                </button>
              </div>
            </div>
          )}

          {/* TAB: POLLS */}
          {activeTab === "polls" && (
            <PollsSection
              eventId={eventId}
              user={user}
              socket={socket}
              darkMode={darkMode}
            />
          )}

          {/* TAB: SUGGESTIONS */}
          {activeTab === "suggestions" && (
            <SuggestionsSection
              eventId={eventId}
              groupId={event.group._id}
              darkMode={darkMode}
            />
          )}

        </div>
      </div>

      {/* FLOATING BOT WIDGET */}
      <BotWidget darkMode={darkMode} />
    </div>
  );
}

