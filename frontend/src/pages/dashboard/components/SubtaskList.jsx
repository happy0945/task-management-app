import React from "react";

const SubtaskList = ({ task, onToggle }) => {
  if (!task.subtasks || task.subtasks.length === 0) return null;

  const done = task.subtasks.filter((s) => s.completed).length;
  const pct = Math.round((done / task.subtasks.length) * 100);

  return (
    <div style={{ marginTop: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 3,
            background: "var(--bg3)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "var(--success)",
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>
        <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
          {done}/{task.subtasks.length}
        </span>
      </div>
      {task.subtasks.map((st) => (
        <div
          key={st._id}
          onClick={() => onToggle(task._id, st._id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            padding: "2px 0",
          }}
        >
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 3,
              border: `1.5px solid ${st.completed ? "var(--success)" : "var(--border2)"}`,
              background: st.completed ? "var(--success)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {st.completed && (
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: st.completed ? "var(--text3)" : "var(--text2)",
              textDecoration: st.completed ? "line-through" : "none",
            }}
          >
            {st.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SubtaskList;
