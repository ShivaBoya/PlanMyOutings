import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function BotWidget({ darkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm PlanPal. Need help planning?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef(null);

    // Colors
    const bgClass = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
    const textClass = darkMode ? "text-slate-100" : "text-slate-800";

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
        setInput("");
        setTyping(true);

        try {
            const res = await fetch(`${BACKEND}/api/bot/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();

            setMessages(prev => [...prev, { text: data.reply || "Sorry, I didn't get that.", sender: "bot" }]);
        } catch (e) {
            setMessages(prev => [...prev, { text: "Network error. Try again?", sender: "bot" }]);
        } finally {
            setTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Box Popup */}
            {isOpen && (
                <div className={`w-80 h-96 mb-4 rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-scale-in origin-bottom-right ${bgClass}`}>

                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <span className="font-bold">PlanPal</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white"><X size={18} /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 dark:bg-slate-800 dark:text-gray-200 rounded-bl-none"}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 animate-pulse-soft">
                                    Typing...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                        <input
                            className={`flex-1 p-2 rounded-lg text-sm outline-none px-3 ${darkMode ? "bg-slate-800 text-white" : "bg-gray-100 text-black"}`}
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center justify-center hover:shadow-blue-500/50 transition-transform active:scale-95 hover:scale-110"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>
        </div>
    );
}
