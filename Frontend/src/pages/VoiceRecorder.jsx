// src/components/chat/VoiceRecorder.jsx
import React, { useState, useRef } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function VoiceRecorder({ onRecorded }) {
  const [rec, setRec] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  // ===========================
  // START RECORDING
  // ===========================
  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = handleStop;

      recorder.start();
      setRec(true);

    } catch (err) {
      console.error("Audio permission denied:", err);
      alert("Microphone permission denied. Please enable it to record audio.");
    }
  }

  // ===========================
  // STOP RECORDING
  // ===========================
  function stop() {
    if (mediaRef.current) {
      mediaRef.current.stop();
      setRec(false);
    }
  }

  // ===========================
  // HANDLE STOP + UPLOAD
  // ===========================
  async function handleStop() {
    try {
      setLoading(true);

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], `voice-${Date.now()}.webm`, {
        type: blob.type,
      });

      // Upload to backend
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${BACKEND}/api/uploads`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        onRecorded({
          url: data.url,
          filename: data.filename,
          type: file.type,
        });
      } else {
        console.error("Upload failed:", data);
        alert("Audio upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload audio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={() => (rec ? stop() : start())}
      disabled={loading}
      style={{
        padding: 10,
        borderRadius: 8,
        background: rec ? "#dc2626" : "#2563eb",
        color: "white",
        minWidth: 45,
        textAlign: "center",
        fontSize: 20,
        transition: "0.2s",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "⏳" : rec ? "⏹" : "🎤"}
    </button>
  );
}
