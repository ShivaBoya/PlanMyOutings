// src/components/chat/FileUploader.jsx
import React, { useRef } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

export default function FileUploader({ onUploaded }) {
  const ref = useRef();

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BACKEND}/api/uploads`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const data = await res.json();
    if (res.ok) onUploaded({ url: data.url, filename: data.filename, type: file.type });
    else alert(data.message || "Upload failed");
  }

  return (
    <>
      <input type="file" ref={ref} style={{ display: "none" }} onChange={e => uploadFile(e.target.files[0])} />
      <button onClick={() => ref.current.click()} style={{ padding: 8, borderRadius: 8 }}>📤</button>
    </>
  );
}
