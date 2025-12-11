import React, { useEffect, useState } from "react";
import { Clock, MapPin, ExternalLink, Calendar, MessageSquare, UserPlus, CheckCircle } from "lucide-react";

// --- COUNTDOWN WIDGET ---
export function CountdownWidget({ targetDate, destination, darkMode }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const textColor = darkMode ? "text-white" : "text-gray-900";

    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full bg-cover bg-center group transition-transform duration-500 hover:scale-[1.01] shadow-2xl ${darkMode ? "shadow-blue-900/20" : "shadow-blue-200"}`}
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')" }}>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300 group-hover:via-black/50" />

            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full text-xs font-bold text-white mb-3">
                    <Clock size={12} /> UPCOMING TRIP
                </div>
                <h2 className="text-3xl font-extrabold text-white leading-tight">
                    Trip to <span className="text-blue-400">{destination}</span>
                </h2>
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-4 gap-2 text-center text-white">
                {Object.keys(timeLeft).map((interval) => (
                    <div key={interval} className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/10">
                        <span className="block text-xl md:text-2xl font-bold">{timeLeft[interval] || 0}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider opacity-70">{interval}</span>
                    </div>
                ))}
            </div>

            <button className="relative z-10 mt-6 w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-blue-50 transition-colors">
                View Itinerary <ExternalLink size={14} />
            </button>
        </div>
    );
}

// --- ACTIVITY FEED WIDGET ---
export function ActivityFeed({ darkMode }) {
    const activities = [
        { type: "vote", user: "Rahul", text: "voted for", subject: "The Spice Villa", time: "2m ago", icon: CheckCircle, color: "text-green-500" },
        { type: "join", user: "Sarah", text: "joined", subject: "Goa Beach Bash", time: "15m ago", icon: UserPlus, color: "text-blue-500" },
        { type: "comment", user: "Mike", text: "commented on", subject: "Itinerary", time: "1h ago", icon: MessageSquare, color: "text-purple-500" },
        { type: "create", user: "You", text: "created", subject: "Sunday Brunch", time: "3h ago", icon: Calendar, color: "text-orange-500" },
    ];

    return (
        <div className={`p-6 rounded-3xl h-full backdrop-blur-xl border flex flex-col ${darkMode ? "bg-slate-900/40 border-white/10 text-white" : "bg-white/60 border-gray-200 text-gray-800"}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Recent Activity</h3>
                <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500 animate-pulse">● Live</span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {activities.map((act, i) => (
                    <div key={i} className="flex gap-3 items-start group">
                        <div className={`mt-1 p-1.5 rounded-full bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10 ${act.color}`}>
                            <act.icon size={12} />
                        </div>
                        <div>
                            <p className="text-sm">
                                <span className="font-bold">{act.user}</span> <span className="opacity-70">{act.text}</span> <span className="font-semibold text-blue-500 lg:text-blue-400">{act.subject}</span>
                            </p>
                            <p className="text-[10px] opacity-50 font-medium">{act.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- STATS WIDGET ---
export function StatsWidget({ icon: Icon, value, label, color, darkMode }) {
    return (
        <div className={`p-5 rounded-2xl backdrop-blur-xl border flex items-center gap-4 transition-all hover:scale-105 cursor-pointer ${darkMode ? "bg-slate-900/40 border-white/10 text-white hover:bg-slate-800/60" : "bg-white/60 border-gray-200 text-gray-800 hover:bg-white/80"}`}>
            <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-2xl font-extrabold">{value}</h4>
                <p className="text-xs font-semibold opacity-60 uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
}

// --- QUICK ACTION MINI CARD ---
export function QuickAction({ icon: Icon, label, onClick, darkMode }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all active:scale-95 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700 shadow-sm"}`}
        >
            <Icon size={20} className="opacity-80" />
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}
