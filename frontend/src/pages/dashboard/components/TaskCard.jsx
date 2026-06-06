import React from "react";
import SubtaskList from "./SubtaskList";
import AISuggestion from "./AISuggestion";

const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onPomodoro,
  onSubtaskToggle,
}) => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatDue = (d) => {
    if (!d) return null;
    const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: "Overdue", color: "var(--danger)" };
    if (days === 0) return { label: "Due today", color: "var(--warning)" };
    if (days === 1) return { label: "Due tomorrow", color: "var(--warning)" };
    return { label: `${days}d left`, color: "var(--text3)" };
  };

  const due = formatDue(task.dueDate);
  const isCompleted = task.status === "completed";

  return (
    <div
      className={`task-card ${isCompleted ? "completed" : ""}`}
      style={{ flexDirection: "column", alignItems: "stretch" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          className={`task-checkbox ${isCompleted ? "checked" : ""}`}
          onClick={() => onToggle(task._id)}
          role="checkbox"
          aria-checked={isCompleted}
          tabIndex={0}
          onKeyDown={(e) => e.key === " " && onToggle(task._id)}
          style={{ marginTop: 2, flexShrink: 0 }}
        >
          {isCompleted && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div className="task-body" style={{ flex: 1 }}>
          <div className={`task-title ${isCompleted ? "done" : ""}`}>
            {task.title}
          </div>
          {task.description && (
            <div className="task-desc">{task.description}</div>
          )}
          <div className="task-meta" style={{ flexWrap: "wrap", gap: 5 }}>
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
            {task.project && (
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--accent2)",
                  background: "rgba(99,102,241,0.1)",
                  padding: "1px 7px",
                  borderRadius: 10,
                }}
              >
                📁 {task.project}
              </span>
            )}
            <span className="task-date">{formatDate(task.createdAt)}</span>
            {due && (
              <span
                style={{
                  fontSize: "0.72rem",
                  color: due.color,
                  fontWeight: 500,
                }}
              >
                📅 {due.label}
              </span>
            )}
            {task.pomodoroCount > 0 && (
              <span style={{ fontSize: "0.72rem", color: "var(--warning)" }}>
                🍅×{task.pomodoroCount}
              </span>
            )}
            {task.mood && (
              <span style={{ fontSize: "0.72rem" }}>
                {task.mood === "great"
                  ? "🟢"
                  : task.mood === "okay"
                    ? "🟡"
                    : "🔴"}
              </span>
            )}
          </div>
          <SubtaskList task={task} onToggle={onSubtaskToggle} />
          {!isCompleted && (
            <div style={{ marginTop: 6 }}>
              <AISuggestion taskId={task._id} />
            </div>
          )}
        </div>
        <div className="task-actions" style={{ flexShrink: 0 }}>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onPomodoro(task)}
            title="Pomodoro"
            style={{ color: "var(--warning)", fontSize: 14 }}
          >
            🍅
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onEdit(task)}
            title="Edit"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={() => onDelete(task)}
            title="Delete"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
