import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MyTrip({ darkMode }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // Glassmorphism Styles
  const cardClass = `p-8 rounded-3xl shadow-xl transition-all border backdrop-blur-md cursor-pointer hover:scale-[1.02] hover:shadow-2xl ${darkMode
    ? "bg-slate-900/60 border-slate-700 text-slate-100"
    : "bg-white/60 border-white/50 text-slate-800"
    }`;

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${backendURL}/api/groups`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) setGroups(data);
    } catch {
      console.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [location.state?.refresh]);

  return (
    <div className="pt-28 px-6 min-h-screen animate-fade-in pb-20">
      <h1 className="text-4xl font-black mb-8 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">
        My Groups 🌍
      </h1>

      {loading && (
        <div className="flex gap-4">
          <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
          <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className={`text-center py-16 rounded-3xl border border-dashed ${darkMode ? "border-slate-700 bg-slate-800/20" : "border-slate-300 bg-white/40"}`}>
          <p className="text-xl font-bold opacity-70 mb-4">No groups yet.</p>
          <button
            onClick={() => navigate("/create")}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Create Your First Group 🚀
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div
            key={g._id}
            onClick={() => navigate(`/group/${g._id}`)}
            className={cardClass}
          >
            <h2 className="text-2xl font-bold mb-2">{g.name}</h2>
            <p className="opacity-70 line-clamp-2 h-12">
              {g.description || "No description provided"}
            </p>

            <div className="mt-6 flex items-center justify-between opacity-80 text-sm">
              <span className="flex items-center gap-1 font-semibold">
                👤 {g.owner?.name?.split(" ")[0]}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full font-bold">
                {g.members?.length} Members
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
