import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Film, Star, RefreshCw, PlusCircle, Filter } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function SuggestionsSection({ eventId, groupId, darkMode }) {
    const [activeTab, setActiveTab] = useState("places"); // places | movies
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mood, setMood] = useState("all");

    // Colors
    const cardBg = darkMode ? "bg-slate-800/80" : "bg-white/80"; // Increased opacity for readability
    const borderColor = darkMode ? "border-slate-700" : "border-slate-200";
    const textColor = darkMode ? "text-slate-100" : "text-slate-800";

    useEffect(() => {
        fetchSuggestions();
    }, [activeTab, mood]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === "places"
                ? `${BACKEND}/api/suggestions/places?groupId=${groupId || ""}&mood=${mood}`
                : `${BACKEND}/api/suggestions/movies?genre=${mood}`;

            const res = await fetch(endpoint, { credentials: "include" });
            const data = await res.json();

            if (res.ok) {
                setResults(activeTab === "places" ? data.results : data.movies);
            } else {
                toast.error("Could not fetch suggestions");
            }
        } catch (e) {
            console.error(e);
            // Fallback is now handled by backend mock, but keep safe empty
            setResults([]);
        } finally {
            setTimeout(() => setLoading(false), 500); // Fake delay for smooth UX
        }
    };

    const addToPoll = async (item) => {
        // Determine the text to add to poll
        const text = item.name || item.title;

        // Check if we should create a new poll or add option (Simulated for this demo)
        // In real app, you would ask user to select which poll to add to, or create new.
        // Here we just trigger a toast for the demo intent.
        toast.info(`Added "${text}" to your Draft Polls!`);
    };

    return (
        <div className={`mt-6 p-6 rounded-3xl border backdrop-blur-xl shadow-lg ${cardBg} ${borderColor} ${textColor}`}>

            {/* HEADER & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    {activeTab === "places" ? <MapPin className="text-green-500" /> : <Film className="text-purple-500" />}
                    AI Suggestions
                </h2>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Mood Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"><Filter size={14} /></div>
                        <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className={`pl-9 pr-4 py-2 rounded-xl text-sm font-semibold outline-none appearance-none border transition-colors cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700 hover:border-slate-500" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}
                        >
                            <option value="all">All Moods</option>
                            {activeTab === 'places' ? (
                                <>
                                    <option value="chill">Chill & Relax</option>
                                    <option value="party">Party & Nightlife</option>
                                    <option value="foodie">Foodie Paradise</option>
                                    <option value="nature">Nature & Parks</option>
                                </>
                            ) : (
                                <>
                                    <option value="action">Action</option>
                                    <option value="comedy">Comedy</option>
                                    <option value="scifi">Sci-Fi</option>
                                    <option value="romance">Romance</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Tabs */}
                    <div className={`p-1 rounded-xl flex ${darkMode ? "bg-slate-900" : "bg-gray-100"}`}>
                        <button
                            onClick={() => setActiveTab("places")}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "places" ? "bg-white text-black shadow-sm" : "opacity-60 hover:opacity-100"}`}
                        >
                            Places
                        </button>
                        <button
                            onClick={() => setActiveTab("movies")}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "movies" ? "bg-white text-black shadow-sm" : "opacity-60 hover:opacity-100"}`}
                        >
                            Movies
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            {loading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center opacity-70 animate-pulse-soft">
                    <RefreshCw className="animate-spin mb-4 w-8 h-8 text-blue-500" />
                    <p className="text-lg font-medium">AI is curating the best {activeTab}...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((item, i) => (
                        <div
                            key={i}
                            className={`group relative rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up ${darkMode ? "bg-slate-900/50 border-slate-700" : "bg-white border-slate-100"}`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="h-40 bg-gray-200 dark:bg-slate-800 w-full relative overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30 text-3xl font-black select-none">?</div>
                                )}

                                {/* Rating Badge */}
                                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-md shadow-lg">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    {(item.rating || item.score)?.toFixed(1)}
                                </div>

                                {/* Type Badge */}
                                {item.type && (
                                    <div className="absolute top-3 left-3 bg-white/90 text-black px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                                        {item.type}
                                    </div>
                                )}
                                {item.genre && (
                                    <div className="absolute top-3 left-3 bg-white/90 text-black px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                                        {item.genre}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <h3 className="font-bold text-lg leading-tight mb-2 truncate">{item.name || item.title}</h3>

                                {item.overview && <p className="text-xs opacity-70 line-clamp-2 mb-3">{item.overview}</p>}

                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs font-semibold opacity-60 flex items-center gap-1">
                                        {item.distance ? (<><MapPin size={12} /> {item.distance}m</>) : item.year}
                                    </span>

                                    <button
                                        onClick={() => addToPoll(item)}
                                        className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-800/60 transition-colors"
                                    >
                                        <PlusCircle size={14} /> Add to Poll
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results.length === 0 && !loading && (
                <div className="text-center py-10 opacity-50">
                    No results found for this mood. Try "All Moods".
                </div>
            )}
        </div>
    );
}
