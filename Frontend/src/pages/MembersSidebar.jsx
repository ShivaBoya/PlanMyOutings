// src/components/chat/MembersSidebar.jsx
import React from "react";

export default function MembersSidebar({ open, onClose, members = [] }) {
  if (!open) return null;
  return (
    <div style={{ width: 260, borderRight: '1px solid #eee', background: '#fff', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Members</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {members.map((m, i) => (
          <div key={i} style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 50, background: '#c7d2fe' }} />
            <div>
              <div style={{ fontWeight: 700 }}>{m.user?.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{m.user?.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
