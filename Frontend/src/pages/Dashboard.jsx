import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background3D from "../components/Background3D";
import { CountdownWidget, ActivityFeed, StatsWidget, QuickAction } from "../components/DashboardWidgets";
import { MapPin, Users, Calendar, BarChart2, Plus, Compass } from "lucide-react";

export default function Dashboard({ darkMode, user, setAuthModalOpen }) {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  const handleCreatePlan = async () => {
    try {
      const res = await fetch(`${backendURL}/api/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401 || !res.ok) {
        setAuthModalOpen(true);
        return;
      }
      navigate("/create");
    } catch (err) {
      console.error(err);
      setAuthModalOpen(true);
    }
  };

  const textColor = darkMode ? "text-white" : "text-gray-900";

  return (
    <div className={`relative min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-12 overflow-hidden ${darkMode ? "bg-slate-900" : "bg-blue-50"}`}>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Background3D />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className={`text-lg font-medium opacity-70 ${textColor}`}>{greeting}, {user?.username || "Traveler"}</p>
            <h1 className={`text-4xl md:text-5xl font-extrabold ${textColor}`}>
              Your Next <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Adventure</span>
            </h1>
          </div>

          <button
            onClick={handleCreatePlan}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95 self-start md:self-auto"
          >
            <Plus size={20} /> New Plan
          </button>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* 1. COUNTDOWN HERO (Spans 2 cols, 2 rows on lg) */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 h-[400px] lg:h-auto">
            <CountdownWidget
              targetDate={new Date(new Date().setDate(new Date().getDate() + 5))} // Mock date 5 days away
              destination="Manali, India"
              darkMode={darkMode}
            />
          </div>

          {/* 2. ACTIVITY FEED (Spans 1 col, 2 rows on lg) */}
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-2 h-[400px] lg:h-auto">
            <ActivityFeed darkMode={darkMode} />
          </div>

          {/* 3. STATS CARDS (Column 4) */}
          <div className="space-y-6 lg:col-span-1 lg:row-span-2 flex flex-col h-full">
            <StatsWidget
              icon={BarChart2}
              value="3"
              label="Pending Votes"
              color={{ bg: "bg-orange-500/20", text: "text-orange-500" }}
              darkMode={darkMode}
            />
            <StatsWidget
              icon={Calendar}
              value="12"
              label="Upcoming Events"
              color={{ bg: "bg-purple-500/20", text: "text-purple-500" }}
              darkMode={darkMode}
            />
            <StatsWidget
              icon={Users}
              value="8"
              label="New Invites"
              color={{ bg: "bg-green-500/20", text: "text-green-500" }}
              darkMode={darkMode}
            />
          </div>

          {/* 4. QUICK ACTIONS ROW (Spans full width or partial) */}
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction darkMode={darkMode} icon={MapPin} label="Find Places" onClick={() => navigate("/restaurants")} />
            <QuickAction darkMode={darkMode} icon={Users} label="My Groups" onClick={() => navigate("/create")} />
            <QuickAction darkMode={darkMode} icon={Compass} label="Trip Ideas" onClick={() => navigate("/movies")} />
            <QuickAction darkMode={darkMode} icon={Calendar} label="Calendar" onClick={() => navigate("/myevents")} />
          </div>

        </div>

      </div>
    </div>
  );
}
