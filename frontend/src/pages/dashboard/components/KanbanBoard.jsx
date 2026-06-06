import React, { useState } from "react";

const KanbanBoard = ({
  tasks,
  onMove,
  onEdit,
  onDelete,
  onPomodoro,
  onSubtaskToggle,
}) => {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const cols = [
    { id: "todo", label: "📋 To Do", color: "var(--text3)" },
    { id: "inprogress", label: "⚡ In Progress", color: "var(--warning)" },
    { id: "completed", label: "✅ Done", color: "var(--success)" },
  ];

  const byCol = {};
  cols.forEach((c) => {
    byCol[c.id] = tasks
      .filter((t) => t.status === c.id)
      .sort((a, b) => a.kanbanOrder - b.kanbanOrder);
  });

  const handleDragStart = (e, task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    if (dragging && dragging.status !== colId) onMove(dragging._id, colId);
    setDragging(null);
    setDragOver(null);
  };

  const formatDue = (d) => {
    if (!d) return null;
    const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: "Overdue", color: "var(--danger)" };
    if (days === 0) return { label: "Today", color: "var(--warning)" };
    return { label: `${days}d`, color: "var(--text3)" };
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 14,
        minHeight: 400,
      }}
    >
      {cols.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(col.id);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleDrop(e, col.id)}
          style={{
            background:
              dragOver === col.id ? "rgba(99,102,241,0.07)" : "var(--surface)",
            border: `1.5px solid ${dragOver === col.id ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "var(--radius)",
            padding: 12,
            transition: "all 0.2s",
            minHeight: 200,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{ fontWeight: 600, fontSize: "0.85rem", color: col.color }}
            >
              {col.label}
            </span>
            <span
              style={{
                background: "var(--bg3)",
                borderRadius: 20,
                padding: "1px 8px",
                fontSize: "0.72rem",
                color: "var(--text3)",
              }}
            >
              {byCol[col.id].length}
            </span>
          </div>
          {byCol[col.id].map((task) => {
            const due = formatDue(task.dueDate);
            const subtasksDone = task.subtasks
              ? task.subtasks.filter((s) => s.completed).length
              : 0;
            const subtasksTotal = task.subtasks ? task.subtasks.length : 0;
            return (
              <div
                key={task._id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 8,
                  cursor: "grab",
                  opacity: dragging?._id === task._id ? 0.4 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "var(--text)",
                      flex: 1,
                    }}
                  >
                    {task.title}
                  </span>
                  <div style={{ display: "flex", gap: 3 }}>
                    <button
                      onClick={() => onPomodoro(task)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: 1,
                      }}
                      title="Pomodoro"
                    >
                      🍅
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        color: "var(--text3)",
                        padding: 1,
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        color: "var(--danger)",
                        padding: 1,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    flexWrap: "wrap",
                    marginBottom: subtasksTotal > 0 ? 6 : 0,
                  }}
                >
                  <span
                    className={`priority-badge ${task.priority}`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {task.priority}
                  </span>
                  {task.project && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--accent2)",
                        background: "var(--bg3)",
                        padding: "1px 6px",
                        borderRadius: 10,
                      }}
                    >
                      📁 {task.project}
                    </span>
                  )}
                  {due && (
                    <span style={{ fontSize: "0.65rem", color: due.color }}>
                      📅 {due.label}
                    </span>
                  )}
                  {task.pomodoroCount > 0 && (
                    <span
                      style={{ fontSize: "0.65rem", color: "var(--warning)" }}
                    >
                      🍅×{task.pomodoroCount}
                    </span>
                  )}
                  {subtasksTotal > 0 && (
                    <span
                      style={{ fontSize: "0.65rem", color: "var(--text3)" }}
                    >
                      ✅{subtasksDone}/{subtasksTotal}
                    </span>
                  )}
                </div>
                {subtasksTotal > 0 && (
                  <div
                    style={{
                      height: 3,
                      background: "var(--bg3)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((subtasksDone / subtasksTotal) * 100)}%`,
                        background: "var(--success)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {byCol[col.id].length === 0 && (
            <div
              style={{
                color: "var(--text3)",
                fontSize: "0.78rem",
                textAlign: "center",
                padding: "20px 0",
                opacity: 0.5,
                border: "1.5px dashed var(--border)",
                borderRadius: 8,
              }}
            >
              Drop tasks here
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
