import React from "react";

const ProjectProgress = ({ tasks }) => {
  const projectMap = {};

  tasks.forEach((t) => {
    if (!t.project) return;
    if (!projectMap[t.project]) projectMap[t.project] = { total: 0, done: 0 };
    projectMap[t.project].total++;
    if (t.status === "completed") projectMap[t.project].done++;
  });

  const projects = Object.entries(projectMap);
  if (projects.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "16px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--text3)",
          fontWeight: 600,
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        📁 Projects
      </div>
      {projects.map(([name, { total, done }]) => {
        const pct = Math.round((done / total) * 100);
        return (
          <div key={name} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
                fontSize: "0.85rem",
              }}
            >
              <span style={{ fontWeight: 500, color: "var(--text)" }}>
                📁 {name}
              </span>
              <span style={{ color: "var(--text3)" }}>
                {done}/{total} ({pct}%)
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
                    pct === 100
                      ? "var(--success)"
                      : "linear-gradient(90deg,var(--accent),var(--accent2))",
                  borderRadius: 4,
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectProgress;
