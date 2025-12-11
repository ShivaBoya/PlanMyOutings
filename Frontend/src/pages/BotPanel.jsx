// src/components/chat/BotPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function BotPanel({ eventId, user }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { from: "bot", text: "Hi! I'm your AI Planner. Need ideas for hotels or spots?" }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  async function send() {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setHistory(h => [...h, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/bot/ask`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();

      if (res.ok) {
        setHistory(h => [...h, { from: "bot", text: data.reply }]);
      } else {
        setHistory(h => [...h, { from: "bot", text: "Oops, I had a glitch. Try again!" }]);
      }
    } catch {
      setHistory(h => [...h, { from: "bot", text: "Network error. Is backend running?" }]);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-slate-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-slate-700">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <Bot size={20} />
        <h3 className="font-bold">PlanPal AI</h3>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((h, i) => {
          const isBot = h.from === "bot";
          return (
            <div key={i} className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}>
              {isBot && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  <Sparkles size={14} />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${isBot
                  ? "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-tl-none"
                  : "bg-indigo-600 text-white rounded-tr-none shadow-md"
                  }`}
              >
                {h.text}
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <Sparkles size={14} className="animate-spin text-indigo-500" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm opacity-50">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask for travel tips..."
          className="flex-1 bg-gray-100 dark:bg-slate-900 border-none outline-none px-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button
          onClick={send}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
