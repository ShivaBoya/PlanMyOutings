// src/components/chat/PollPanel.jsx
import React, { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function PollPanel({ eventId, user }) {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${BACKEND}/api/events/${eventId}/polls`, { credentials: "include" });
    const data = await res.json();
    if (res.ok) setPolls(data);
  }

  async function createPoll() {
    const opts = options.filter(Boolean).map((o, i) => ({ id: `opt${i}`, text: o }));
    const res = await fetch(`${BACKEND}/api/events/${eventId}/polls`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options: opts })
    });
    const data = await res.json();
    if (res.ok) {
      setQuestion(""); setOptions(["", ""]); load();
    } else alert(data.message || "Failed");
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Polls</h3>
      <div>
        {polls.map(p => (
          <div key={p._id} style={{ padding: 8, borderRadius: 8, marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{p.question}</div>
            <div style={{ fontSize: 13 }}>{p.options?.map(o => o.text).join(" • ")}</div>
            {/* votes display omitted here; use poll:get for details */}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Question" />
        {options.map((opt, i) => (
          <input key={i} value={opt} onChange={e => { const copy = [...options]; copy[i] = e.target.value; setOptions(copy); }} placeholder={`Option ${i + 1}`} />
        ))}
        <button onClick={() => setOptions([...options, ""])}>+ Option</button>
        <button onClick={createPoll}>Create Poll</button>
      </div>
    </div>
  );
}
