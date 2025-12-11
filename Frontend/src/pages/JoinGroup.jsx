import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function JoinGroup({ darkMode }) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  const cardBg = darkMode ? "#1f2937" : "white";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const inputBg = darkMode ? "#111827" : "#ffffff";
  const borderColor = darkMode ? "#374151" : "#d1d5db";

  const joinGroup = async (e) => {
    e.preventDefault();

    if (!inviteCode.trim()) return toast.error("Enter invite code");

    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/groups/${id}/join`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Successfully joined the group!");
        navigate(`/group/${id}`);
      } else {
        toast.error(data.message || "Invalid invite code");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="pt-24 min-h-screen flex justify-center px-4"
      style={{ color: textColor }}
    >
      <div
        className="w-full max-w-lg p-8 rounded-2xl shadow-xl"
        style={{ background: cardBg, border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Join Group
        </h1>

        <form onSubmit={joinGroup} className="space-y-6">
          <div>
            <label className="font-semibold text-lg mb-1 block">
              Enter Invite Code
            </label>
            <input
              type="text"
              placeholder="Invite code..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-3 rounded-lg border"
              style={{ background: inputBg, borderColor, color: textColor }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-lg"
            style={{ background: loading ? "#6b7280" : "#2563eb" }}
          >
            {loading ? "Joining..." : "Join Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
