import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const NLPBar = ({ onTaskCreated }) => {
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setParsing(true);
    try {
      const res = await api.post("/tasks/parse-nl", { text });
      setParsed(res.data.parsed);
    } catch {
      toast.error("Could not parse task");
    } finally {
      setParsing(false);
    }
  };

  const handleCreate = async () => {
    if (!parsed) return;
    try {
      await api.post("/tasks", parsed);
      toast.success("✅ Task created!");
      setText("");
      setParsed(null);
      onTaskCreated();
    } catch {
      toast.error("Failed to create task");
    }
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 14,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          color: "var(--accent)",
          fontWeight: 600,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        🪄 Natural Language
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder='"Buy groceries tomorrow high priority"'
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setParsed(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleParse()}
        />
        <button
          className="btn btn-primary"
          onClick={handleParse}
          disabled={parsing || !text.trim()}
          style={{ whiteSpace: "nowrap" }}
        >
          {parsing ? "..." : "✨ Parse"}
        </button>
      </div>
      {parsed && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            background: "var(--bg3)",
            borderRadius: 8,
            border: "1px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <strong style={{ color: "var(--text)", fontSize: "0.9rem" }}>
              {parsed.title}
            </strong>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 4,
                flexWrap: "wrap",
              }}
            >
              <span className={`priority-badge ${parsed.priority}`}>
                {parsed.priority}
              </span>
              {parsed.dueDate && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text2)",
                    background: "var(--bg2)",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  📅 {parsed.dueDate}
                </span>
              )}
              {parsed.project && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--accent2)",
                    background: "var(--bg2)",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  📁 {parsed.project}
                </span>
              )}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            Create ✓
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setParsed(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default NLPBar;
