import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    BarChart2,
    PlusCircle,
    CheckCircle,
    Trash2,
    XCircle
} from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function PollsSection({ eventId, user, socket, darkMode }) {
    const [polls, setPolls] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(true);

    // Colors
    const cardBg = darkMode ? "bg-slate-800/50" : "bg-white/60";
    const borderColor = darkMode ? "border-slate-700" : "border-slate-200";
    const textColor = darkMode ? "text-slate-100" : "text-slate-800";

    useEffect(() => {
        fetchPolls();

        if (socket) {
            socket.on("poll:create", (newPoll) => {
                setPolls((prev) => [newPoll, ...prev]);
            });

            socket.on("poll:vote", ({ pollId, poll }) => {
                setPolls((prev) => prev.map((p) => (p._id === pollId ? poll : p)));
            });

            socket.on("poll:vote_removed", ({ pollId }) => {
                // Ideally we should fetch the updated poll, but simpler to just refetch all or find way to update local
                // For now, let's refetch that specific poll or all
                fetchPolls();
            });
        }

        return () => {
            if (socket) {
                socket.off("poll:create");
                socket.off("poll:vote");
                socket.off("poll:vote_removed");
            }
        };
    }, [eventId, socket]);

    const fetchPolls = async () => {
        try {
            const res = await fetch(`${BACKEND}/api/events/${eventId}/polls`, {
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) setPolls(data);
        } catch (error) {
            console.error("Error loading polls:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!question.trim()) return toast.error("Question required");
        const validOptions = options.filter((o) => o.trim());
        if (validOptions.length < 2) return toast.error("At least 2 options required");

        try {
            const res = await fetch(`${BACKEND}/api/events/${eventId}/polls`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    question,
                    options: validOptions,
                }),
            });

            if (res.ok) {
                toast.success("Poll created!");
                setShowCreate(false);
                setQuestion("");
                setOptions(["", ""]);
            } else {
                const d = await res.json();
                toast.error(d.message || "Failed to create");
            }
        } catch (e) {
            toast.error("Network error");
        }
    };

    const handleVote = async (pollId, optionId) => {
        try {
            const res = await fetch(`${BACKEND}/api/polls/${pollId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ optionId }),
            });
            if (res.ok) {
                toast.success("Voted!");
            } else {
                const d = await res.json();
                toast.error(d.message);
            }
        } catch (e) {
            toast.error("Err voting");
        }
    };

    // UI Helpers
    const getTotalVotes = (poll) => poll.votes.length;
    const getOptionVotes = (poll, optId) =>
        poll.votes.filter((v) => v.optionId === optId).length;

    const hasVoted = (poll) => poll.votes.some((v) => v.user?._id === user?._id || v.user === user?._id);
    const myVote = (poll) => poll.votes.find((v) => v.user?._id === user?._id || v.user === user?._id)?.optionId;

    return (
        <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-md shadow-sm ${cardBg} ${borderColor} ${textColor}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-blue-500" />
                    Polls
                </h2>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                >
                    {showCreate ? <XCircle size={18} /> : <PlusCircle size={18} />}
                    {showCreate ? "Cancel" : "New Poll"}
                </button>
            </div>

            {/* CREATE FORM */}
            {showCreate && (
                <div className={`mb-8 p-4 rounded-xl border border-dashed border-blue-400/50 ${darkMode ? "bg-slate-900/50" : "bg-blue-50/50"}`}>
                    <label className="block text-sm font-semibold opacity-75 mb-1">Question</label>
                    <input
                        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none mb-4 ${darkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`}
                        placeholder="Where should we go?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />

                    <label className="block text-sm font-semibold opacity-75 mb-1">Options</label>
                    <div className="space-y-2 mb-4">
                        {options.map((opt, idx) => (
                            <input
                                key={idx}
                                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`}
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={(e) => {
                                    const newOpts = [...options];
                                    newOpts[idx] = e.target.value;
                                    setOptions(newOpts);
                                }}
                            />
                        ))}
                        <button
                            onClick={() => setOptions([...options, ""])}
                            className="text-sm text-blue-500 hover:underline font-semibold"
                        >
                            + Add Option
                        </button>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-[1.01] transition-transform"
                    >
                        Launch Poll
                    </button>
                </div>
            )}

            {/* POLLS LIST */}
            {loading ? (
                <p className="opacity-50 text-center py-4">Loading polls...</p>
            ) : polls.length === 0 ? (
                <div className="text-center opacity-50 py-8 border-2 border-dashed rounded-xl border-slate-500/20">
                    <p>No polls yet. Start the conversation!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {polls.map((poll) => {
                        const total = getTotalVotes(poll);
                        return (
                            <div key={poll._id} className={`p-5 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                                <h3 className="text-lg font-bold mb-3">{poll.question}</h3>

                                <div className="space-y-3">
                                    {poll.options.map((opt) => {
                                        const votes = getOptionVotes(poll, opt.id || opt._id); // fallback for legacy
                                        const percent = total > 0 ? Math.round((votes / total) * 100) : 0;
                                        const isSelected = myVote(poll) === opt.id;

                                        return (
                                            <div key={opt.id} className="relative group cursor-pointer" onClick={() => handleVote(poll._id, opt.id)}>
                                                {/* Background Bar */}
                                                <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700/50 h-full">
                                                    <div
                                                        className={`h-full transition-all duration-500 ease-out ${isSelected ? "bg-blue-500/20" : "bg-gray-300/20 dark:bg-gray-600/20"}`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className={`relative p-3 flex justify-between items-center z-10 border rounded-lg transition-colors ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"}`}>
                                                    <span className="font-medium flex items-center gap-2">
                                                        {isSelected && <CheckCircle size={16} className="text-blue-500" />}
                                                        {opt.text}
                                                    </span>
                                                    <span className="text-sm font-bold opacity-75">{percent}% ({votes})</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-3 flex justify-between items-center text-xs opacity-60">
                                    <span>{total} votes</span>
                                    {hasVoted(poll) && <span>You voted</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
