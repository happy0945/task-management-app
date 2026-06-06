import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

const MoodReportModal = ({ onClose }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api
      .get("/tasks/mood-report")
      .then((r) => setReport(r.data))
      .catch(() => {});
  }, []);

  if (!report) return null;

  const { report: r, total } = report;
  const moods = [
    { key: "great", emoji: "🟢", label: "Great" },
    { key: "okay", emoji: "🟡", label: "Okay" },
    { key: "tired", emoji: "🔴", label: "Tired" },
  ];

  const best =
    total > 0
      ? moods.reduce((a, b) => ((r[a.key] || 0) >= (r[b.key] || 0) ? a : b))
      : null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <span className="modal-title">😊 Mood Report</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ padding: "16px 0" }}>
          {total === 0 ? (
            <div
              style={{
                color: "var(--text3)",
                textAlign: "center",
                padding: 20,
              }}
            >
              Abhi tak koi mood data nahi hai. Tasks complete karo!
            </div>
          ) : (
            <>
              {best && (
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: 16,
                    padding: "10px",
                    background: "var(--bg3)",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>
                    Sabse productive mood
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    {best.emoji} {best.label}
                  </div>
                </div>
              )}
              {moods.map((m) => {
                const count = r[m.key] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={m.key} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>
                        {m.emoji} {m.label}
                      </span>
                      <span style={{ color: "var(--text3)" }}>
                        {count} tasks ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "var(--bg3)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background:
                            m.key === "great"
                              ? "var(--success)"
                              : m.key === "okay"
                                ? "var(--warning)"
                                : "var(--danger)",
                          borderRadius: 4,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodReportModal;
