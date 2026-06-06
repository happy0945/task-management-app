import React from "react";

const GamificationBar = ({ gamification, newBadge }) => {
  if (!gamification) return null;
  const { xp, streak, badges, totalCompleted } = gamification;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, var(--surface) 0%, rgba(99,102,241,0.08) 100%)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "14px 18px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text3)",
              textTransform: "uppercase",
            }}
          >
            Level
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            ⚡ {level}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 100 }}>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text3)",
              marginBottom: 3,
            }}
          >
            XP: {xp}
          </div>
          <div
            style={{
              height: 5,
              background: "var(--bg3)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${xpInLevel}%`,
                background:
                  "linear-gradient(90deg,var(--accent),var(--accent2))",
                borderRadius: 3,
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text3)",
              textTransform: "uppercase",
            }}
          >
            Streak
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--warning)",
            }}
          >
            🔥 {streak}d
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text3)",
              textTransform: "uppercase",
            }}
          >
            Done
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--success)",
            }}
          >
            ✅ {totalCompleted}
          </div>
        </div>
        {badges && badges.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {badges.map((b) => (
              <span
                key={b}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: 20,
                  padding: "2px 7px",
                  fontSize: "0.68rem",
                  color: "var(--accent2)",
                  whiteSpace: "nowrap",
                }}
              >
                {b === "Early Bird"
                  ? "🐦"
                  : b === "Night Owl"
                    ? "🦉"
                    : b === "Week Warrior"
                      ? "⚔️"
                      : b === "Marathoner"
                        ? "🏃"
                        : b === "Task Master"
                          ? "👑"
                          : "🏅"}{" "}
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      {newBadge && (
        <div
          style={{
            marginTop: 10,
            padding: "6px 12px",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid var(--accent)",
            borderRadius: 8,
            fontSize: "0.82rem",
            color: "var(--accent2)",
            textAlign: "center",
          }}
        >
          🎉 New badge: <strong>{newBadge}</strong>
        </div>
      )}
    </div>
  );
};

export default GamificationBar;
