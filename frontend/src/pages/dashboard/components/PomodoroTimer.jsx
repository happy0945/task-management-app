import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const PomodoroTimer = ({ task, onComplete, onClose }) => {
  const WORK = 25 * 60,
    BREAK = 5 * 60;
  const [seconds, setSeconds] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const iRef = useRef(null);

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(iRef.current);
            setRunning(false);
            if (!isBreak) {
              onComplete();
              toast.success("🍅 Pomodoro done! +10 XP!");
              setIsBreak(true);
              return BREAK;
            } else {
              toast("☕ Break over!");
              setIsBreak(false);
              return WORK;
            }
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(iRef.current);
  }, [running, isBreak, onComplete]);

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  const pct = isBreak
    ? ((BREAK - seconds) / BREAK) * 100
    : ((WORK - seconds) / WORK) * 100;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 340, textAlign: "center" }}>
        <div className="modal-header">
          <span className="modal-title">🍅 Pomodoro</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text3)",
              marginBottom: 8,
            }}
          >
            {isBreak ? "☕ Break" : "🎯 Focus"} — {task.title}
          </div>
          <div
            style={{
              position: "relative",
              width: 150,
              height: 150,
              margin: "0 auto 16px",
            }}
          >
            <svg
              viewBox="0 0 36 36"
              style={{
                transform: "rotate(-90deg)",
                width: "100%",
                height: "100%",
              }}
            >
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="var(--bg3)"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={isBreak ? "var(--success)" : "var(--accent)"}
                strokeWidth="2.5"
                strokeDasharray={`${pct} 100`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: "var(--text)",
                }}
              >
                {m}:{s}
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
                🍅×{task.pomodoroCount || 0}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              className={`btn ${running ? "btn-ghost" : "btn-primary"}`}
              onClick={() => setRunning((r) => !r)}
              style={{ minWidth: 80 }}
            >
              {running ? "⏸ Pause" : "▶ Start"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setSeconds(isBreak ? BREAK : WORK);
                setRunning(false);
              }}
            >
              ↺
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
