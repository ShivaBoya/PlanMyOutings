import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { CheckCheck } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";
const socket = io(BACKEND, { withCredentials: true });

export default function Chatting({ user, darkMode }) {
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Mobile View State: 'list' or 'chat'
  const [mobileView, setMobileView] = useState("list");

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);

  const scrollBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    loadContacts();
    loadRecentChats();

    socket.emit("auth:user", { userId: user?._id });

    socket.on("dm:message", (msg) => {
      // If we are already in this chat, append message
      if (selectedChat && msg.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
        scrollBottom();
      }
      // Re-load recent chats to update order/preview
      loadRecentChats();
    });

    socket.on("dm:typing", (data) => {
      if (selectedChat?._id === data.chatId && data.userId !== user._id) {
        setTypingUser(data.userName);
        setTimeout(() => setTypingUser(null), 1500);
      }
    });

    socket.on("dm:seen", (data) => {
      if (selectedChat?._id === data.chatId) {
        setMessages((prev) =>
          prev.map((m) =>
            data.messageIds.includes(m._id)
              ? { ...m, status: "seen" }
              : m
          )
        );
      }
    });

    return () => {
      socket.off("dm:message");
      socket.off("dm:typing");
      socket.off("dm:seen");
    };
  }, [selectedChat]);

  async function loadContacts() {
    try {
      const res = await fetch(`${BACKEND}/api/chat/contacts`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setContacts(data.contacts || []);
    } catch (err) {
      console.error("Contacts Error:", err);
    }
  }

  async function loadRecentChats() {
    try {
      const res = await fetch(`${BACKEND}/api/chat/list`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setChats(data.chats || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function openChat(otherUserId) {
    try {
      const res = await fetch(`${BACKEND}/api/chat/start`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: otherUserId }),
      });

      const data = await res.json();

      if (res.ok && data.chat) {
        setSelectedChat(data.chat);
        loadMessages(data.chat._id);

        // SWITCH TO CHAT VIEW ON MOBILE
        setMobileView("chat");

        socket.emit("dm:join", data.chat._id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages(chatId) {
    try {
      const res = await fetch(`${BACKEND}/api/chat/${chatId}/messages`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages || []);
        setTimeout(scrollBottom, 300);

        socket.emit("dm:seen", {
          chatId,
          userId: user._id,
          messageIds: data.messages.map((m) => m._id),
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  function onTyping() {
    if (!selectedChat) return;
    socket.emit("dm:typing", {
      chatId: selectedChat._id,
      userId: user._id,
      userName: user.name,
    });
  }

  function sendMessage() {
    if (!input.trim() || !selectedChat) return;

    socket.emit("dm:message", {
      chatId: selectedChat._id,
      senderId: user._id,
      text: input.trim(),
    });

    setInput("");
  }

  // Styles
  const sidebarClass = `w-full md:w-80 border-r flex flex-col backdrop-blur-xl transition-all ${darkMode ? "bg-slate-900/60 border-slate-700" : "bg-white/60 border-white/50"
    } ${mobileView === "chat" ? "hidden md:flex" : "flex"}`;

  const chatAreaClass = `flex-1 flex flex-col backdrop-blur-xl transition-all ${darkMode ? "bg-slate-900/40" : "bg-white/40"
    } ${mobileView === "list" ? "hidden md:flex" : "flex"}`;

  return (
    <div className="flex h-full w-full">
      {/* -----------------------------------------
          LEFT SIDEBAR (Contacts)
      ----------------------------------------- */}
      <div className={sidebarClass}>
        <div className="p-4 border-b border-current/10">
          <input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm"
              }`}
          />
        </div>

        <h3 className="px-4 py-3 font-bold opacity-60 text-xs uppercase tracking-wider">Recent Contacts</h3>

        <div className="flex-1 overflow-y-auto">
          {contacts
            .filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((c) => (
              <button
                key={c._id}
                onClick={() => openChat(c._id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${selectedChat?.users.find(u => u._id === c._id)
                  ? "bg-blue-500/10 border-r-4 border-blue-500"
                  : "hover:bg-current/5"
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${darkMode ? "from-indigo-600 to-purple-600" : "from-blue-500 to-cyan-500"
                  }`}>
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs opacity-60 truncate max-w-[150px]">{c.email}</div>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* -----------------------------------------
          RIGHT CHAT WINDOW
      ----------------------------------------- */}
      <div className={chatAreaClass}>
        {/* Chat Header */}
        {selectedChat ? (
          <div className={`p-4 border-b flex items-center gap-3 ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/70 border-white/50"
            }`}>
            {/* BACK BUTTON (MOBILE ONLY) */}
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden px-3 py-1 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-bold"
            >
              ← Back
            </button>

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {selectedChat.users.find((u) => u._id !== user._id)?.name.charAt(0)}
            </div>

            <div>
              <div className="font-bold">
                {selectedChat.users.find((u) => u._id !== user._id)?.name}
              </div>
              <div className="text-xs text-green-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-xl font-bold">Select a user to chat</p>
          </div>
        )}

        {/* Messages Area */}
        {selectedChat && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const mine = m.sender?._id === user._id;

                return (
                  <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300 group`}>
                    <div
                      className={`max-w-[75%] px-4 py-2 relative shadow-sm text-sm ${mine
                        ? "bg-[#005c4b] text-white rounded-l-xl rounded-tr-xl rounded-br-none"
                        : darkMode
                          ? "bg-[#202c33] text-white rounded-r-xl rounded-tl-xl rounded-bl-none"
                          : "bg-white text-slate-800 rounded-r-xl rounded-tl-xl rounded-bl-none border border-gray-100"
                        }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed pb-4">{m.text}</p>

                      {/* TIMESTAMP & TICKS */}
                      <div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[10px] ${mine ? "text-white/70" : "opacity-50"}`}>
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {mine && (
                          <CheckCheck
                            size={14}
                            className={m.status === "seen" ? "text-blue-400" : "text-white/60"}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />

              {typingUser && (
                <div className="text-xs font-bold opacity-50 px-2">{typingUser} is typing...</div>
              )}
            </div>

            {/* Input Box */}
            <div className={`p-4 border-t flex gap-2 ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/70 border-white/50"
              }`}>
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  onTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className={`flex-1 p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  }`}
              />

              <button
                onClick={sendMessage}
                className="px-6 py-2 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div >
  );
}
