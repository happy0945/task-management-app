import React, { useState } from "react";
import api from "../../../utils/api";

const MoodPicker = ({ taskId, onDone }) => {
  const [selected, setSelected] = useState(null);

  const moods = [
    { key: "great", emoji: "🟢", label: "Great" },
    { key: "okay", emoji: "🟡", label: "Okay" },
    { key: "tired", emoji: "🔴", label: "Tired" },
  ];

  const submit = async (mood) => {
    setSelected(mood);
    try {
      await api.patch(`/tasks/${taskId}/mood`, { mood });
    } catch {}
    setTimeout(onDone, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 320, textAlign: "center" }}>
        <div style={{ padding: "24px 20px" }}>
          <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>
            🎉 Task Complete!
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--text2)",
              marginBottom: 20,
            }}
          >
            Abhi kaise feel kar rahe ho?
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {moods.map((m) => (
              <button
                key={m.key}
                onClick={() => submit(m.key)}
                style={{
                  background:
                    selected === m.key ? "var(--accent)" : "var(--bg3)",
                  border: `2px solid ${selected === m.key ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "1.6rem" }}>{m.emoji}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 16 }}
            onClick={onDone}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodPicker;
