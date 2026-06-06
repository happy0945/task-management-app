import React, { useState } from "react";
import api from "../../../utils/api";

const AISuggestion = ({ taskId }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggestion = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${taskId}/suggestion`);
      setSuggestion(res.data.suggestion);
    } catch(err) {
      console.error("AI suggestion error:", err.message);
      setSuggestion("❌ " + (err.response?.data?.message || "API error"));
    } finally {
      setLoading(false);
    }
  };

  if (suggestion)
    return (
      <div
        style={{
          marginTop: 6,
          padding: "6px 10px",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 8,
          fontSize: "0.78rem",
          color: "var(--accent2)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ flex: 1 }}>{suggestion}</span>
        <button
          onClick={() => setSuggestion(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text3)",
            fontSize: 11,
          }}
        >
          ✕
        </button>
      </div>
    );

  return (
    <button
      onClick={fetchSuggestion}
      disabled={loading}
      style={{
        background: "none",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 6,
        padding: "2px 7px",
        cursor: "pointer",
        color: "var(--accent2)",
        fontSize: "0.7rem",
      }}
    >
      {loading ? "..." : "🤖 AI Tip"}
    </button>
  );
};

export default AISuggestion;
