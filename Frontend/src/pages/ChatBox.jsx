
// src/pages/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import MembersSidebar from "./MembersSidebar";
import VoiceRecorder from "./VoiceRecorder";
import FileUploader from "./FileUploader";
import PollPanel from "./PollPanel";
import ThemePicker from "./ThemePicker";
import Chatting from "./Chatting";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";
const socket = io(BACKEND, { withCredentials: true });

export default function ChatBox({ darkMode, user }) {
  const { eventId } = useParams();

  // ⭐ NEW — Switch between Group Chat / Personal Chat (for mobile)
  const [activeTab, setActiveTab] = useState("group");

  // Existing group chat states (unchanged)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membersOpen, setMembersOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [theme, setTheme] = useState("default");
  const bottomRef = useRef(null);

  // Auto scroll
  const scrollBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  // Load event chat
  useEffect(() => {
    loadMessages();
    loadMembers();

    socket.emit("join:event", eventId);
    socket.emit("auth:user", { userId: user?._id });

    socket.on("message:create", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollBottom();
    });

    socket.on("message:reaction", (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? msg : m))
      );
    });

    socket.on("typing", (data) => {
      if (data.userId !== user?._id) {
        setTypingUser(data.userName);
        setTimeout(() => setTypingUser(null), 1200);
      }
    });

    return () => {
      socket.off("message:create");
      socket.off("message:reaction");
      socket.off("typing");
    };
  }, [eventId]);

  async function loadMessages() {
    try {
      const res = await fetch(
        `${BACKEND}/api/events/${eventId}/messages`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch {
      toast.error("Error loading messages");
    }

    setLoading(false);
    setTimeout(scrollBottom, 200);
  }

  async function loadMembers() {
    try {
      const res = await fetch(
        `${BACKEND}/api/events/${eventId}/members`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setMembers(data.members);
    } catch { }
  }

  function sendTyping() {
    socket.emit("typing", {
      eventId,
      userId: user?._id,
      userName: user?.name,
    });
  }

  function sendMessage() {
    if (!input.trim()) return;

    socket.emit("message:create", {
      text: input.trim(),
      eventId,
      senderId: user._id,
    });

    setInput("");
  }

  function onFileUpload({ url, filename, type }) {
    fetch(`${BACKEND}/api/events/${eventId}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "",
        attachments: [{ url, type, filename }],
      }),
    })
      .then((res) => res.json())
      .then((msg) => {
        setMessages((prev) => [...prev, msg]);
        scrollBottom();
      });
  }

  function sendReaction(messageId, emoji) {
    socket.emit("message:reaction", {
      messageId,
      emoji,
      userId: user._id,
    });
  }

  // Styles
  const glassPanel = `flex flex-col h-full border-r backdrop-blur-xl ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/70 border-white/50"
    }`;

  const mainChatArea = `flex-1 flex flex-col h-full backdrop-blur-xl relative z-10 ${darkMode ? "bg-slate-900/50" : "bg-white/40"
    }`;

  const headerClass = `p-4 flex justify-between items-center backdrop-blur-md border-b ${darkMode ? "bg-slate-900/90 border-slate-700 text-white" : "bg-white/80 border-white/50 text-slate-800"
    }`;

  const inputAreaClass = `p-4 flex gap-2 backdrop-blur-md border-t ${darkMode ? "bg-slate-900/90 border-slate-700" : "bg-white/80 border-white/50"
    }`;

  // ===========================================================
  // UI
  // ===========================================================
  return (
    <div className="pt-20 h-screen flex flex-col md:flex-row overflow-hidden animate-fade-in relative z-10">

      {/* MOBILE TABS */}
      <div className={`md:hidden flex justify-around p-2 ${darkMode ? "bg-slate-900" : "bg-white"} border-b`}>
        <button
          onClick={() => setActiveTab("group")}
          className={`px-4 py-2 rounded-xl font-bold text-sm ${activeTab === "group" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700"
            }`}
        >
          Group Chat
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 rounded-xl font-bold text-sm ${activeTab === "personal" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-slate-700"
            }`}
        >
          Direct Msgs
        </button>
      </div>

      {/* =====================================================
         GROUP CHAT SECTION
      ====================================================== */}
      <div className={`flex-1 flex-col md:flex-row h-full ${activeTab === 'group' ? 'flex' : 'hidden md:flex'}`}>
        {/* Main Chat Area */}
        <div className={mainChatArea}>

          <MembersSidebar
            open={membersOpen}
            onClose={() => setMembersOpen(false)}
            members={members}
          />

          {/* HEADER */}
          <div className={headerClass}>
            <h2 className="text-xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Event Chat 💬
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setMembersOpen(true)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-200 dark:bg-slate-700 hover:brightness-110"
              >
                👥 Members
              </button>
              <ThemePicker theme={theme} setTheme={setTheme} />
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const mine = m.sender?._id === user._id;
              return (
                <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl relative shadow-sm ${mine
                      ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-none"
                      : darkMode
                        ? "bg-slate-800 text-white rounded-tl-none border border-slate-700"
                        : "bg-white text-slate-800 rounded-tl-none border border-white/60"
                      }`}
                  >
                    {!mine && (
                      <p className="text-xs font-bold opacity-70 mb-1">{m.sender?.name}</p>
                    )}
                    <p>{m.text}</p>

                    {/* REACTIONS */}
                    <div className="mt-2 flex gap-1">
                      {["❤️", "😂", "👍"].map((e) => (
                        <button
                          key={e}
                          onClick={() => sendReaction(m._id, e)}
                          className="hover:scale-125 transition-transform"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* TYPING INDICATOR */}
          {typingUser && (
            <div className="px-4 py-1 text-xs font-bold opacity-60 animate-pulse">
              {typingUser} is typing...
            </div>
          )}

          {/* INPUT AREA */}
          <div className={inputAreaClass}>
            <FileUploader onUploaded={onFileUpload} />
            <VoiceRecorder onRecorded={(a) => onFileUpload(a)} />

            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                sendTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className={`flex-1 p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                }`}
            />

            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
         PERSONAL CHAT SECTION (WhatsApp style)
      ====================================================== */}
      <div className={`h-full md:w-1/3 md:border-l dark:border-slate-700 border-white/20 ${activeTab === 'personal' ? 'block' : 'hidden md:block'}`}>
        <Chatting user={user} darkMode={darkMode} />
      </div>

    </div>
  );
}
