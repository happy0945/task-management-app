import React from "react";

const Heatmap = ({ data }) => {
  const weeks = 12;
  const today = new Date();
  const days = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: data[key] || 0, day: d.getDay() });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const getColor = (count) => {
    if (count === 0) return "var(--bg3)";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "#1a3a2a";
    if (intensity < 0.5) return "#1e6b3c";
    if (intensity < 0.75) return "#26a65b";
    return "#2ecc71";
  };

  const cols = [];
  for (let w = 0; w < weeks; w++) {
    cols.push(days.slice(w * 7, w * 7 + 7));
  }

  const months = [];
  cols.forEach((col, wi) => {
    const firstDay = col[0];
    if (firstDay) {
      const m = new Date(firstDay.date).toLocaleDateString("en-US", {
        month: "short",
      });
      if (wi === 0 || months[months.length - 1]?.label !== m)
        months.push({ label: m, col: wi });
    }
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          fontSize: "0.7rem",
          color: "var(--text3)",
          marginBottom: 6,
          display: "flex",
          gap: 16,
        }}
      >
        {months.map((m) => (
          <span
            key={`${m.label}-${m.col}`}
            style={{ minWidth: `${m.col * 14}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {cols.map((col, wi) => (
          <div
            key={wi}
            style={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {col.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date}: ${cell.count} tasks`}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  background: getColor(cell.count),
                  cursor: "default",
                  transition: "transform 0.1s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.3)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
          fontSize: "0.65rem",
          color: "var(--text3)",
        }}
      >
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background:
                i === 0
                  ? "var(--bg3)"
                  : i < 0.25
                    ? "#1a3a2a"
                    : i < 0.5
                      ? "#1e6b3c"
                      : i < 0.75
                        ? "#26a65b"
                        : "#2ecc71",
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
