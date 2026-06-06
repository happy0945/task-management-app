// import React, { useState, useEffect, useCallback, useRef } from "react";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";
// import api from "../utils/api";
// import TaskModal from "../components/TaskModal";
// import ConfirmDialog from "../components/ConfirmDialog";

// const PomodoroTimer = ({ task, onComplete, onClose }) => {
//   const WORK = 25 * 60,
//     BREAK = 5 * 60;
//   const [seconds, setSeconds] = useState(WORK);
//   const [running, setRunning] = useState(false);
//   const [isBreak, setIsBreak] = useState(false);
//   const iRef = useRef(null);
//   useEffect(() => {
//     if (running) {
//       iRef.current = setInterval(() => {
//         setSeconds((s) => {
//           if (s <= 1) {
//             clearInterval(iRef.current);
//             setRunning(false);
//             if (!isBreak) {
//               onComplete();
//               toast.success("🍅 Pomodoro done! +10 XP!");
//               setIsBreak(true);
//               return BREAK;
//             } else {
//               toast("☕ Break over!");
//               setIsBreak(false);
//               return WORK;
//             }
//           }
//           return s - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(iRef.current);
//   }, [running, isBreak, onComplete]);

//   const m = String(Math.floor(seconds / 60)).padStart(2, "0");
//   const s = String(seconds % 60).padStart(2, "0");
//   const pct = isBreak
//     ? ((BREAK - seconds) / BREAK) * 100
//     : ((WORK - seconds) / WORK) * 100;

//   return (
//     <div
//       className="modal-overlay"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="modal" style={{ maxWidth: 340, textAlign: "center" }}>
//         <div className="modal-header">
//           <span className="modal-title">🍅 Pomodoro</span>
//           <button className="btn btn-ghost btn-icon" onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div style={{ padding: "16px 0" }}>
//           <div
//             style={{
//               fontSize: "0.75rem",
//               color: "var(--text3)",
//               marginBottom: 8,
//             }}
//           >
//             {isBreak ? "☕ Break" : "🎯 Focus"} — {task.title}
//           </div>
//           <div
//             style={{
//               position: "relative",
//               width: 150,
//               height: 150,
//               margin: "0 auto 16px",
//             }}
//           >
//             <svg
//               viewBox="0 0 36 36"
//               style={{
//                 transform: "rotate(-90deg)",
//                 width: "100%",
//                 height: "100%",
//               }}
//             >
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.9"
//                 fill="none"
//                 stroke="var(--bg3)"
//                 strokeWidth="2.5"
//               />
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.9"
//                 fill="none"
//                 stroke={isBreak ? "var(--success)" : "var(--accent)"}
//                 strokeWidth="2.5"
//                 strokeDasharray={`${pct} 100`}
//                 strokeLinecap="round"
//                 style={{ transition: "stroke-dasharray 1s linear" }}
//               />
//             </svg>
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "2rem",
//                   fontWeight: 700,
//                   fontFamily: "monospace",
//                   color: "var(--text)",
//                 }}
//               >
//                 {m}:{s}
//               </span>
//               <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
//                 🍅×{task.pomodoroCount || 0}
//               </span>
//             </div>
//           </div>
//           <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
//             <button
//               className={`btn ${running ? "btn-ghost" : "btn-primary"}`}
//               onClick={() => setRunning((r) => !r)}
//               style={{ minWidth: 80 }}
//             >
//               {running ? "⏸ Pause" : "▶ Start"}
//             </button>
//             <button
//               className="btn btn-ghost"
//               onClick={() => {
//                 setSeconds(isBreak ? BREAK : WORK);
//                 setRunning(false);
//               }}
//             >
//               ↺
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // NLP BAR
// const NLPBar = ({ onTaskCreated }) => {
//   const [text, setText] = useState("");
//   const [parsing, setParsing] = useState(false);
//   const [parsed, setParsed] = useState(null);
//   const handleParse = async () => {
//     if (!text.trim()) return;
//     setParsing(true);
//     try {
//       const res = await api.post("/tasks/parse-nl", { text });
//       setParsed(res.data.parsed);
//     } catch {
//       toast.error("Could not parse task");
//     } finally {
//       setParsing(false);
//     }
//   };
//   const handleCreate = async () => {
//     if (!parsed) return;
//     try {
//       await api.post("/tasks", parsed);
//       toast.success("✅ Task created!");
//       setText("");
//       setParsed(null);
//       onTaskCreated();
//     } catch {
//       toast.error("Failed to create task");
//     }
//   };
//   return (
//     <div
//       style={{
//         background: "var(--surface)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius)",
//         padding: 14,
//         marginBottom: 16,
//       }}
//     >
//       <div
//         style={{
//           fontSize: "0.7rem",
//           color: "var(--accent)",
//           fontWeight: 600,
//           marginBottom: 6,
//           textTransform: "uppercase",
//           letterSpacing: 0.5,
//         }}
//       >
//         🪄 Natural Language
//       </div>
//       <div style={{ display: "flex", gap: 8 }}>
//         <input
//           type="text"
//           className="form-input"
//           style={{ flex: 1 }}
//           placeholder='"Buy groceries tomorrow high priority"'
//           value={text}
//           onChange={(e) => {
//             setText(e.target.value);
//             setParsed(null);
//           }}
//           onKeyDown={(e) => e.key === "Enter" && handleParse()}
//         />
//         <button
//           className="btn btn-primary"
//           onClick={handleParse}
//           disabled={parsing || !text.trim()}
//           style={{ whiteSpace: "nowrap" }}
//         >
//           {parsing ? "..." : "✨ Parse"}
//         </button>
//       </div>
//       {parsed && (
//         <div
//           style={{
//             marginTop: 10,
//             padding: 10,
//             background: "var(--bg3)",
//             borderRadius: 8,
//             border: "1px solid var(--accent)",
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ flex: 1 }}>
//             <strong style={{ color: "var(--text)", fontSize: "0.9rem" }}>
//               {parsed.title}
//             </strong>
//             <div
//               style={{
//                 display: "flex",
//                 gap: 6,
//                 marginTop: 4,
//                 flexWrap: "wrap",
//               }}
//             >
//               <span className={`priority-badge ${parsed.priority}`}>
//                 {parsed.priority}
//               </span>
//               {parsed.dueDate && (
//                 <span
//                   style={{
//                     fontSize: "0.72rem",
//                     color: "var(--text2)",
//                     background: "var(--bg2)",
//                     padding: "2px 8px",
//                     borderRadius: 20,
//                   }}
//                 >
//                   📅 {parsed.dueDate}
//                 </span>
//               )}
//               {parsed.project && (
//                 <span
//                   style={{
//                     fontSize: "0.72rem",
//                     color: "var(--accent2)",
//                     background: "var(--bg2)",
//                     padding: "2px 8px",
//                     borderRadius: 20,
//                   }}
//                 >
//                   📁 {parsed.project}
//                 </span>
//               )}
//             </div>
//           </div>
//           <button className="btn btn-primary btn-sm" onClick={handleCreate}>
//             Create ✓
//           </button>
//           <button
//             className="btn btn-ghost btn-sm"
//             onClick={() => setParsed(null)}
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // GAMIFICATION BAR
// // ─────────────────────────────────────────────────────────────
// const GamificationBar = ({ gamification, newBadge }) => {
//   if (!gamification) return null;
//   const { xp, streak, badges, totalCompleted } = gamification;
//   const level = Math.floor(xp / 100) + 1;
//   const xpInLevel = xp % 100;
//   return (
//     <div
//       style={{
//         background:
//           "linear-gradient(135deg, var(--surface) 0%, rgba(99,102,241,0.08) 100%)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius)",
//         padding: "14px 18px",
//         marginBottom: 16,
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           gap: 20,
//           flexWrap: "wrap",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <div
//             style={{
//               fontSize: "0.65rem",
//               color: "var(--text3)",
//               textTransform: "uppercase",
//             }}
//           >
//             Level
//           </div>
//           <div
//             style={{
//               fontSize: "1.3rem",
//               fontWeight: 700,
//               color: "var(--accent)",
//             }}
//           >
//             ⚡ {level}
//           </div>
//         </div>
//         <div style={{ flex: 1, minWidth: 100 }}>
//           <div
//             style={{
//               fontSize: "0.65rem",
//               color: "var(--text3)",
//               marginBottom: 3,
//             }}
//           >
//             XP: {xp}
//           </div>
//           <div
//             style={{
//               height: 5,
//               background: "var(--bg3)",
//               borderRadius: 3,
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 height: "100%",
//                 width: `${xpInLevel}%`,
//                 background:
//                   "linear-gradient(90deg,var(--accent),var(--accent2))",
//                 borderRadius: 3,
//                 transition: "width 0.5s",
//               }}
//             />
//           </div>
//         </div>
//         <div>
//           <div
//             style={{
//               fontSize: "0.65rem",
//               color: "var(--text3)",
//               textTransform: "uppercase",
//             }}
//           >
//             Streak
//           </div>
//           <div
//             style={{
//               fontSize: "1.1rem",
//               fontWeight: 700,
//               color: "var(--warning)",
//             }}
//           >
//             🔥 {streak}d
//           </div>
//         </div>
//         <div>
//           <div
//             style={{
//               fontSize: "0.65rem",
//               color: "var(--text3)",
//               textTransform: "uppercase",
//             }}
//           >
//             Done
//           </div>
//           <div
//             style={{
//               fontSize: "1.1rem",
//               fontWeight: 700,
//               color: "var(--success)",
//             }}
//           >
//             ✅ {totalCompleted}
//           </div>
//         </div>
//         {badges && badges.length > 0 && (
//           <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
//             {badges.map((b) => (
//               <span
//                 key={b}
//                 style={{
//                   background: "var(--bg3)",
//                   border: "1px solid var(--border2)",
//                   borderRadius: 20,
//                   padding: "2px 7px",
//                   fontSize: "0.68rem",
//                   color: "var(--accent2)",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {b === "Early Bird"
//                   ? "🐦"
//                   : b === "Night Owl"
//                     ? "🦉"
//                     : b === "Week Warrior"
//                       ? "⚔️"
//                       : b === "Marathoner"
//                         ? "🏃"
//                         : b === "Task Master"
//                           ? "👑"
//                           : "🏅"}{" "}
//                 {b}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//       {newBadge && (
//         <div
//           style={{
//             marginTop: 10,
//             padding: "6px 12px",
//             background: "rgba(99,102,241,0.15)",
//             border: "1px solid var(--accent)",
//             borderRadius: 8,
//             fontSize: "0.82rem",
//             color: "var(--accent2)",
//             textAlign: "center",
//           }}
//         >
//           🎉 New badge: <strong>{newBadge}</strong>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // AI SUGGESTION
// // ─────────────────────────────────────────────────────────────
// const AISuggestion = ({ taskId }) => {
//   const [suggestion, setSuggestion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const fetch = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/tasks/${taskId}/suggestion`);
//       setSuggestion(res.data.suggestion);
//     } catch {
//       setSuggestion("💡 Is task ko do parts mein tod do!");
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (suggestion)
//     return (
//       <div
//         style={{
//           marginTop: 6,
//           padding: "6px 10px",
//           background: "rgba(99,102,241,0.1)",
//           border: "1px solid rgba(99,102,241,0.3)",
//           borderRadius: 8,
//           fontSize: "0.78rem",
//           color: "var(--accent2)",
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//         }}
//       >
//         <span style={{ flex: 1 }}>{suggestion}</span>
//         <button
//           onClick={() => setSuggestion(null)}
//           style={{
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             color: "var(--text3)",
//             fontSize: 11,
//           }}
//         >
//           ✕
//         </button>
//       </div>
//     );
//   return (
//     <button
//       onClick={fetch}
//       disabled={loading}
//       style={{
//         background: "none",
//         border: "1px solid rgba(99,102,241,0.3)",
//         borderRadius: 6,
//         padding: "2px 7px",
//         cursor: "pointer",
//         color: "var(--accent2)",
//         fontSize: "0.7rem",
//       }}
//     >
//       {loading ? "..." : "🤖 AI Tip"}
//     </button>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // SUBTASK LIST
// // ─────────────────────────────────────────────────────────────
// const SubtaskList = ({ task, onToggle }) => {
//   if (!task.subtasks || task.subtasks.length === 0) return null;
//   const done = task.subtasks.filter((s) => s.completed).length;
//   const pct = Math.round((done / task.subtasks.length) * 100);
//   return (
//     <div style={{ marginTop: 6 }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           marginBottom: 4,
//         }}
//       >
//         <div
//           style={{
//             flex: 1,
//             height: 3,
//             background: "var(--bg3)",
//             borderRadius: 2,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               height: "100%",
//               width: `${pct}%`,
//               background: "var(--success)",
//               borderRadius: 2,
//               transition: "width 0.3s",
//             }}
//           />
//         </div>
//         <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
//           {done}/{task.subtasks.length}
//         </span>
//       </div>
//       {task.subtasks.map((st) => (
//         <div
//           key={st._id}
//           onClick={() => onToggle(task._id, st._id)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             cursor: "pointer",
//             padding: "2px 0",
//           }}
//         >
//           <div
//             style={{
//               width: 13,
//               height: 13,
//               borderRadius: 3,
//               border: `1.5px solid ${st.completed ? "var(--success)" : "var(--border2)"}`,
//               background: st.completed ? "var(--success)" : "transparent",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             {st.completed && (
//               <svg
//                 width="8"
//                 height="8"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="white"
//                 strokeWidth="3"
//               >
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             )}
//           </div>
//           <span
//             style={{
//               fontSize: "0.75rem",
//               color: st.completed ? "var(--text3)" : "var(--text2)",
//               textDecoration: st.completed ? "line-through" : "none",
//             }}
//           >
//             {st.title}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // MOOD PICKER (shown after completing a task)
// // ─────────────────────────────────────────────────────────────
// const MoodPicker = ({ taskId, onDone }) => {
//   const [selected, setSelected] = useState(null);
//   const moods = [
//     { key: "great", emoji: "🟢", label: "Great" },
//     { key: "okay", emoji: "🟡", label: "Okay" },
//     { key: "tired", emoji: "🔴", label: "Tired" },
//   ];
//   const submit = async (mood) => {
//     setSelected(mood);
//     try {
//       await api.patch(`/tasks/${taskId}/mood`, { mood });
//     } catch {}
//     setTimeout(onDone, 600);
//   };
//   return (
//     <div className="modal-overlay">
//       <div className="modal" style={{ maxWidth: 320, textAlign: "center" }}>
//         <div style={{ padding: "24px 20px" }}>
//           <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>
//             🎉 Task Complete!
//           </div>
//           <div
//             style={{
//               fontSize: "0.9rem",
//               color: "var(--text2)",
//               marginBottom: 20,
//             }}
//           >
//             Abhi kaise feel kar rahe ho?
//           </div>
//           <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
//             {moods.map((m) => (
//               <button
//                 key={m.key}
//                 onClick={() => submit(m.key)}
//                 style={{
//                   background:
//                     selected === m.key ? "var(--accent)" : "var(--bg3)",
//                   border: `2px solid ${selected === m.key ? "var(--accent)" : "var(--border)"}`,
//                   borderRadius: 12,
//                   padding: "12px 16px",
//                   cursor: "pointer",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: 4,
//                   transition: "all 0.2s",
//                 }}
//               >
//                 <span style={{ fontSize: "1.6rem" }}>{m.emoji}</span>
//                 <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
//                   {m.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//           <button
//             className="btn btn-ghost btn-sm"
//             style={{ marginTop: 16 }}
//             onClick={onDone}
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // MOOD REPORT MODAL
// // ─────────────────────────────────────────────────────────────
// const MoodReportModal = ({ onClose }) => {
//   const [report, setReport] = useState(null);
//   useEffect(() => {
//     api
//       .get("/tasks/mood-report")
//       .then((r) => setReport(r.data))
//       .catch(() => {});
//   }, []);
//   if (!report) return null;
//   const { report: r, total } = report;
//   const moods = [
//     { key: "great", emoji: "🟢", label: "Great" },
//     { key: "okay", emoji: "🟡", label: "Okay" },
//     { key: "tired", emoji: "🔴", label: "Tired" },
//   ];
//   const best =
//     total > 0
//       ? moods.reduce((a, b) => ((r[a.key] || 0) >= (r[b.key] || 0) ? a : b))
//       : null;
//   return (
//     <div
//       className="modal-overlay"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="modal" style={{ maxWidth: 380 }}>
//         <div className="modal-header">
//           <span className="modal-title">😊 Mood Report</span>
//           <button className="btn btn-ghost btn-icon" onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div style={{ padding: "16px 0" }}>
//           {total === 0 ? (
//             <div
//               style={{
//                 color: "var(--text3)",
//                 textAlign: "center",
//                 padding: 20,
//               }}
//             >
//               Abhi tak koi mood data nahi hai. Tasks complete karo!
//             </div>
//           ) : (
//             <>
//               {best && (
//                 <div
//                   style={{
//                     textAlign: "center",
//                     marginBottom: 16,
//                     padding: "10px",
//                     background: "var(--bg3)",
//                     borderRadius: 10,
//                   }}
//                 >
//                   <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>
//                     Sabse productive mood
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "1.2rem",
//                       fontWeight: 700,
//                       color: "var(--accent)",
//                     }}
//                   >
//                     {best.emoji} {best.label}
//                   </div>
//                 </div>
//               )}
//               {moods.map((m) => {
//                 const count = r[m.key] || 0;
//                 const pct = total > 0 ? Math.round((count / total) * 100) : 0;
//                 return (
//                   <div key={m.key} style={{ marginBottom: 12 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: 4,
//                         fontSize: "0.85rem",
//                       }}
//                     >
//                       <span>
//                         {m.emoji} {m.label}
//                       </span>
//                       <span style={{ color: "var(--text3)" }}>
//                         {count} tasks ({pct}%)
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         height: 8,
//                         background: "var(--bg3)",
//                         borderRadius: 4,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <div
//                         style={{
//                           height: "100%",
//                           width: `${pct}%`,
//                           background:
//                             m.key === "great"
//                               ? "var(--success)"
//                               : m.key === "okay"
//                                 ? "var(--warning)"
//                                 : "var(--danger)",
//                           borderRadius: 4,
//                           transition: "width 0.5s",
//                         }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // HEATMAP (GitHub-style)
// // ─────────────────────────────────────────────────────────────
// const Heatmap = ({ data }) => {
//   const weeks = 12;
//   const today = new Date();
//   const days = [];
//   for (let i = weeks * 7 - 1; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(d.getDate() - i);
//     const key = d.toISOString().slice(0, 10);
//     days.push({ date: key, count: data[key] || 0, day: d.getDay() });
//   }
//   const maxCount = Math.max(...days.map((d) => d.count), 1);
//   const getColor = (count) => {
//     if (count === 0) return "var(--bg3)";
//     const intensity = count / maxCount;
//     if (intensity < 0.25) return "#1a3a2a";
//     if (intensity < 0.5) return "#1e6b3c";
//     if (intensity < 0.75) return "#26a65b";
//     return "#2ecc71";
//   };
//   const cols = [];
//   for (let w = 0; w < weeks; w++) {
//     cols.push(days.slice(w * 7, w * 7 + 7));
//   }
//   const months = [];
//   cols.forEach((col, wi) => {
//     const firstDay = col[0];
//     if (firstDay) {
//       const m = new Date(firstDay.date).toLocaleDateString("en-US", {
//         month: "short",
//       });
//       if (wi === 0 || months[months.length - 1]?.label !== m)
//         months.push({ label: m, col: wi });
//     }
//   });
//   return (
//     <div style={{ overflowX: "auto" }}>
//       <div
//         style={{
//           fontSize: "0.7rem",
//           color: "var(--text3)",
//           marginBottom: 6,
//           display: "flex",
//           gap: 16,
//         }}
//       >
//         {months.map((m) => (
//           <span
//             key={`${m.label}-${m.col}`}
//             style={{ minWidth: `${m.col * 14}px` }}
//           >
//             {m.label}
//           </span>
//         ))}
//       </div>
//       <div style={{ display: "flex", gap: 3 }}>
//         {cols.map((col, wi) => (
//           <div
//             key={wi}
//             style={{ display: "flex", flexDirection: "column", gap: 3 }}
//           >
//             {col.map((cell) => (
//               <div
//                 key={cell.date}
//                 title={`${cell.date}: ${cell.count} tasks`}
//                 style={{
//                   width: 11,
//                   height: 11,
//                   borderRadius: 2,
//                   background: getColor(cell.count),
//                   cursor: "default",
//                   transition: "transform 0.1s",
//                 }}
//                 onMouseEnter={(e) => (e.target.style.transform = "scale(1.3)")}
//                 onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           marginTop: 8,
//           fontSize: "0.65rem",
//           color: "var(--text3)",
//         }}
//       >
//         <span>Less</span>
//         {[0, 0.25, 0.5, 0.75, 1].map((i) => (
//           <div
//             key={i}
//             style={{
//               width: 10,
//               height: 10,
//               borderRadius: 2,
//               background:
//                 i === 0
//                   ? "var(--bg3)"
//                   : i < 0.25
//                     ? "#1a3a2a"
//                     : i < 0.5
//                       ? "#1e6b3c"
//                       : i < 0.75
//                         ? "#26a65b"
//                         : "#2ecc71",
//             }}
//           />
//         ))}
//         <span>More</span>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // PROJECT PROGRESS
// // ─────────────────────────────────────────────────────────────
// const ProjectProgress = ({ tasks }) => {
//   const projectMap = {};
//   tasks.forEach((t) => {
//     if (!t.project) return;
//     if (!projectMap[t.project]) projectMap[t.project] = { total: 0, done: 0 };
//     projectMap[t.project].total++;
//     if (t.status === "completed") projectMap[t.project].done++;
//   });
//   const projects = Object.entries(projectMap);
//   if (projects.length === 0) return null;
//   return (
//     <div
//       style={{
//         background: "var(--surface)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius)",
//         padding: "16px",
//         marginBottom: 16,
//       }}
//     >
//       <div
//         style={{
//           fontSize: "0.75rem",
//           color: "var(--text3)",
//           fontWeight: 600,
//           marginBottom: 12,
//           textTransform: "uppercase",
//           letterSpacing: 0.5,
//         }}
//       >
//         📁 Projects
//       </div>
//       {projects.map(([name, { total, done }]) => {
//         const pct = Math.round((done / total) * 100);
//         return (
//           <div key={name} style={{ marginBottom: 12 }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: 5,
//                 fontSize: "0.85rem",
//               }}
//             >
//               <span style={{ fontWeight: 500, color: "var(--text)" }}>
//                 📁 {name}
//               </span>
//               <span style={{ color: "var(--text3)" }}>
//                 {done}/{total} ({pct}%)
//               </span>
//             </div>
//             <div
//               style={{
//                 height: 8,
//                 background: "var(--bg3)",
//                 borderRadius: 4,
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   width: `${pct}%`,
//                   background:
//                     pct === 100
//                       ? "var(--success)"
//                       : "linear-gradient(90deg,var(--accent),var(--accent2))",
//                   borderRadius: 4,
//                   transition: "width 0.5s",
//                 }}
//               />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // TRASH PANEL
// // ─────────────────────────────────────────────────────────────
// const TrashPanel = ({ onClose, onRestored }) => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     api
//       .get("/tasks?status=trash&limit=50")
//       .then((r) => setItems(r.data.tasks || []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);
//   const restore = async (id) => {
//     await api.patch(`/tasks/${id}/restore`);
//     setItems((p) => p.filter((t) => t._id !== id));
//     toast.success("Task restored! ↩️");
//     onRestored();
//   };
//   const perm = async (id) => {
//     await api.delete(`/tasks/${id}/permanent`);
//     setItems((p) => p.filter((t) => t._id !== id));
//     toast("Task permanently deleted");
//   };
//   return (
//     <div
//       className="modal-overlay"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="modal" style={{ maxWidth: 500 }}>
//         <div className="modal-header">
//           <span className="modal-title">🗑️ Trash (30-day)</span>
//           <button className="btn btn-ghost btn-icon" onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div style={{ padding: "8px 0", maxHeight: 400, overflowY: "auto" }}>
//           {loading ? (
//             <div style={{ padding: 30, textAlign: "center" }}>
//               <div className="spinner" />
//             </div>
//           ) : items.length === 0 ? (
//             <div
//               style={{
//                 color: "var(--text3)",
//                 textAlign: "center",
//                 padding: 30,
//               }}
//             >
//               Trash is empty 🎉
//             </div>
//           ) : (
//             items.map((t) => (
//               <div
//                 key={t._id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   padding: "10px 4px",
//                   borderBottom: "1px solid var(--border)",
//                 }}
//               >
//                 <div style={{ flex: 1 }}>
//                   <div
//                     style={{
//                       fontSize: "0.9rem",
//                       color: "var(--text)",
//                       textDecoration: "line-through",
//                       opacity: 0.7,
//                     }}
//                   >
//                     {t.title}
//                   </div>
//                   <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
//                     Deleted {new Date(t.deletedAt).toLocaleDateString()}
//                   </div>
//                 </div>
//                 <button
//                   className="btn btn-ghost btn-sm"
//                   onClick={() => restore(t._id)}
//                 >
//                   ↩ Restore
//                 </button>
//                 <button
//                   className="btn btn-danger btn-sm"
//                   onClick={() => perm(t._id)}
//                 >
//                   ✕ Delete
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // KANBAN BOARD
// // ─────────────────────────────────────────────────────────────
// const KanbanBoard = ({
//   tasks,
//   onMove,
//   onEdit,
//   onDelete,
//   onPomodoro,
//   onSubtaskToggle,
// }) => {
//   const [dragging, setDragging] = useState(null);
//   const [dragOver, setDragOver] = useState(null);
//   const cols = [
//     { id: "todo", label: "📋 To Do", color: "var(--text3)" },
//     { id: "inprogress", label: "⚡ In Progress", color: "var(--warning)" },
//     { id: "completed", label: "✅ Done", color: "var(--success)" },
//   ];
//   const byCol = {};
//   cols.forEach((c) => {
//     byCol[c.id] = tasks
//       .filter((t) => t.status === c.id)
//       .sort((a, b) => a.kanbanOrder - b.kanbanOrder);
//   });

//   const handleDragStart = (e, task) => {
//     setDragging(task);
//     e.dataTransfer.effectAllowed = "move";
//   };
//   const handleDrop = (e, colId) => {
//     e.preventDefault();
//     if (dragging && dragging.status !== colId) onMove(dragging._id, colId);
//     setDragging(null);
//     setDragOver(null);
//   };

//   const formatDue = (d) => {
//     if (!d) return null;
//     const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
//     if (days < 0) return { label: "Overdue", color: "var(--danger)" };
//     if (days === 0) return { label: "Today", color: "var(--warning)" };
//     return { label: `${days}d`, color: "var(--text3)" };
//   };

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(3,1fr)",
//         gap: 14,
//         minHeight: 400,
//       }}
//     >
//       {cols.map((col) => (
//         <div
//           key={col.id}
//           onDragOver={(e) => {
//             e.preventDefault();
//             setDragOver(col.id);
//           }}
//           onDragLeave={() => setDragOver(null)}
//           onDrop={(e) => handleDrop(e, col.id)}
//           style={{
//             background:
//               dragOver === col.id ? "rgba(99,102,241,0.07)" : "var(--surface)",
//             border: `1.5px solid ${dragOver === col.id ? "var(--accent)" : "var(--border)"}`,
//             borderRadius: "var(--radius)",
//             padding: 12,
//             transition: "all 0.2s",
//             minHeight: 200,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 12,
//             }}
//           >
//             <span
//               style={{ fontWeight: 600, fontSize: "0.85rem", color: col.color }}
//             >
//               {col.label}
//             </span>
//             <span
//               style={{
//                 background: "var(--bg3)",
//                 borderRadius: 20,
//                 padding: "1px 8px",
//                 fontSize: "0.72rem",
//                 color: "var(--text3)",
//               }}
//             >
//               {byCol[col.id].length}
//             </span>
//           </div>
//           {byCol[col.id].map((task) => {
//             const due = formatDue(task.dueDate);
//             const subtasksDone = task.subtasks
//               ? task.subtasks.filter((s) => s.completed).length
//               : 0;
//             const subtasksTotal = task.subtasks ? task.subtasks.length : 0;
//             return (
//               <div
//                 key={task._id}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, task)}
//                 style={{
//                   background: "var(--bg2)",
//                   border: "1px solid var(--border)",
//                   borderRadius: 10,
//                   padding: "10px 12px",
//                   marginBottom: 8,
//                   cursor: "grab",
//                   opacity: dragging?._id === task._id ? 0.4 : 1,
//                   transition: "opacity 0.15s",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                     gap: 6,
//                     marginBottom: 6,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "0.85rem",
//                       fontWeight: 500,
//                       color: "var(--text)",
//                       flex: 1,
//                     }}
//                   >
//                     {task.title}
//                   </span>
//                   <div style={{ display: "flex", gap: 3 }}>
//                     <button
//                       onClick={() => onPomodoro(task)}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: 13,
//                         padding: 1,
//                       }}
//                       title="Pomodoro"
//                     >
//                       🍅
//                     </button>
//                     <button
//                       onClick={() => onEdit(task)}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: 12,
//                         color: "var(--text3)",
//                         padding: 1,
//                       }}
//                     >
//                       ✏️
//                     </button>
//                     <button
//                       onClick={() => onDelete(task)}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: 12,
//                         color: "var(--danger)",
//                         padding: 1,
//                       }}
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 5,
//                     flexWrap: "wrap",
//                     marginBottom: subtasksTotal > 0 ? 6 : 0,
//                   }}
//                 >
//                   <span
//                     className={`priority-badge ${task.priority}`}
//                     style={{ fontSize: "0.65rem" }}
//                   >
//                     {task.priority}
//                   </span>
//                   {task.project && (
//                     <span
//                       style={{
//                         fontSize: "0.65rem",
//                         color: "var(--accent2)",
//                         background: "var(--bg3)",
//                         padding: "1px 6px",
//                         borderRadius: 10,
//                       }}
//                     >
//                       📁 {task.project}
//                     </span>
//                   )}
//                   {due && (
//                     <span style={{ fontSize: "0.65rem", color: due.color }}>
//                       📅 {due.label}
//                     </span>
//                   )}
//                   {task.pomodoroCount > 0 && (
//                     <span
//                       style={{ fontSize: "0.65rem", color: "var(--warning)" }}
//                     >
//                       🍅×{task.pomodoroCount}
//                     </span>
//                   )}
//                   {subtasksTotal > 0 && (
//                     <span
//                       style={{ fontSize: "0.65rem", color: "var(--text3)" }}
//                     >
//                       ✅{subtasksDone}/{subtasksTotal}
//                     </span>
//                   )}
//                 </div>
//                 {subtasksTotal > 0 && (
//                   <div
//                     style={{
//                       height: 3,
//                       background: "var(--bg3)",
//                       borderRadius: 2,
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       style={{
//                         height: "100%",
//                         width: `${Math.round((subtasksDone / subtasksTotal) * 100)}%`,
//                         background: "var(--success)",
//                         borderRadius: 2,
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//           {byCol[col.id].length === 0 && (
//             <div
//               style={{
//                 color: "var(--text3)",
//                 fontSize: "0.78rem",
//                 textAlign: "center",
//                 padding: "20px 0",
//                 opacity: 0.5,
//                 border: "1.5px dashed var(--border)",
//                 borderRadius: 8,
//               }}
//             >
//               Drop tasks here
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // TASK CARD (list view)
// // ─────────────────────────────────────────────────────────────
// const TaskCard = ({
//   task,
//   onToggle,
//   onEdit,
//   onDelete,
//   onPomodoro,
//   onSubtaskToggle,
//   onUndoDelete,
// }) => {
//   const formatDate = (d) =>
//     new Date(d).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   const formatDue = (d) => {
//     if (!d) return null;
//     const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
//     if (days < 0) return { label: "Overdue", color: "var(--danger)" };
//     if (days === 0) return { label: "Due today", color: "var(--warning)" };
//     if (days === 1) return { label: "Due tomorrow", color: "var(--warning)" };
//     return { label: `${days}d left`, color: "var(--text3)" };
//   };
//   const due = formatDue(task.dueDate);
//   const isCompleted = task.status === "completed";
//   return (
//     <div
//       className={`task-card ${isCompleted ? "completed" : ""}`}
//       style={{ flexDirection: "column", alignItems: "stretch" }}
//     >
//       <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
//         <div
//           className={`task-checkbox ${isCompleted ? "checked" : ""}`}
//           onClick={() => onToggle(task._id)}
//           role="checkbox"
//           aria-checked={isCompleted}
//           tabIndex={0}
//           onKeyDown={(e) => e.key === " " && onToggle(task._id)}
//           style={{ marginTop: 2, flexShrink: 0 }}
//         >
//           {isCompleted && (
//             <svg
//               width="12"
//               height="12"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="3"
//             >
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//           )}
//         </div>
//         <div className="task-body" style={{ flex: 1 }}>
//           <div className={`task-title ${isCompleted ? "done" : ""}`}>
//             {task.title}
//           </div>
//           {task.description && (
//             <div className="task-desc">{task.description}</div>
//           )}
//           <div className="task-meta" style={{ flexWrap: "wrap", gap: 5 }}>
//             <span className={`priority-badge ${task.priority}`}>
//               {task.priority}
//             </span>
//             {task.project && (
//               <span
//                 style={{
//                   fontSize: "0.72rem",
//                   color: "var(--accent2)",
//                   background: "rgba(99,102,241,0.1)",
//                   padding: "1px 7px",
//                   borderRadius: 10,
//                 }}
//               >
//                 📁 {task.project}
//               </span>
//             )}
//             <span className="task-date">{formatDate(task.createdAt)}</span>
//             {due && (
//               <span
//                 style={{
//                   fontSize: "0.72rem",
//                   color: due.color,
//                   fontWeight: 500,
//                 }}
//               >
//                 📅 {due.label}
//               </span>
//             )}
//             {task.pomodoroCount > 0 && (
//               <span style={{ fontSize: "0.72rem", color: "var(--warning)" }}>
//                 🍅×{task.pomodoroCount}
//               </span>
//             )}
//             {task.mood && (
//               <span style={{ fontSize: "0.72rem" }}>
//                 {task.mood === "great"
//                   ? "🟢"
//                   : task.mood === "okay"
//                     ? "🟡"
//                     : "🔴"}
//               </span>
//             )}
//           </div>
//           <SubtaskList task={task} onToggle={onSubtaskToggle} />
//           {!isCompleted && (
//             <div style={{ marginTop: 6 }}>
//               <AISuggestion taskId={task._id} />
//             </div>
//           )}
//         </div>
//         <div className="task-actions" style={{ flexShrink: 0 }}>
//           <button
//             className="btn btn-ghost btn-icon btn-sm"
//             onClick={() => onPomodoro(task)}
//             title="Pomodoro"
//             style={{ color: "var(--warning)", fontSize: 14 }}
//           >
//             🍅
//           </button>
//           <button
//             className="btn btn-ghost btn-icon btn-sm"
//             onClick={() => onEdit(task)}
//             title="Edit"
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
//               <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
//             </svg>
//           </button>
//           <button
//             className="btn btn-danger btn-icon btn-sm"
//             onClick={() => onDelete(task)}
//             title="Delete"
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <polyline points="3 6 5 6 21 6" />
//               <path d="M19 6l-1 14H6L5 6" />
//               <path d="M10 11v6M14 11v6" />
//               <path d="M9 6V4h6v2" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // MAIN DASHBOARD
// // ─────────────────────────────────────────────────────────────
// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [allTasks, setAllTasks] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     todo: 0,
//     inprogress: 0,
//     completed: 0,
//   });
//   const [pagination, setPagination] = useState({
//     current: 1,
//     total: 1,
//     count: 0,
//   });
//   const [loadingTasks, setLoadingTasks] = useState(true);
//   const [gamification, setGamification] = useState(null);
//   const [newBadge, setNewBadge] = useState(null);
//   const [heatmap, setHeatmap] = useState({});
//   const [projects, setProjects] = useState([]);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [priorityFilter, setPriorityFilter] = useState("all");
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [page, setPage] = useState(1);

//   const [viewMode, setViewMode] = useState("list"); // 'list' | 'kanban'
//   const [showHeatmap, setShowHeatmap] = useState(false);
//   const [showMoodReport, setShowMoodReport] = useState(false);
//   const [showTrash, setShowTrash] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [editTask, setEditTask] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);

//   const [pomodoroTask, setPomodoroTask] = useState(null);
//   const [moodTask, setMoodTask] = useState(null);

//   const prevBadgesRef = useRef([]);

//   const fetchTasks = useCallback(
//     async (fetchAll = false) => {
//       setLoadingTasks(true);
//       try {
//         const params = new URLSearchParams();
//         if (search.trim()) params.append("search", search.trim());
//         if (statusFilter !== "all") params.append("status", statusFilter);
//         if (priorityFilter !== "all") params.append("priority", priorityFilter);
//         if (projectFilter !== "all") params.append("project", projectFilter);
//         params.append("page", page);
//         params.append("limit", viewMode === "kanban" ? 100 : 8);
//         const res = await api.get(`/tasks?${params.toString()}`);
//         setTasks(res.data.tasks);
//         setStats(res.data.stats);
//         setPagination(res.data.pagination);
//         if (res.data.gamification) setGamification(res.data.gamification);
//         if (res.data.heatmap) setHeatmap(res.data.heatmap);
//         if (res.data.projects) setProjects(res.data.projects);
//         // for project progress bar we always need all active tasks
//         if (viewMode === "list" && res.data.projects.length > 0) {
//           const allRes = await api.get("/tasks?limit=200");
//           setAllTasks(allRes.data.tasks);
//         }
//       } catch {
//         toast.error("Failed to load tasks");
//       } finally {
//         setLoadingTasks(false);
//       }
//     },
//     [search, statusFilter, priorityFilter, projectFilter, page, viewMode],
//   );

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const applyGamification = (g, prevBadges) => {
//     if (!g) return;
//     const added = g.badges.find((b) => !prevBadges.includes(b));
//     if (added) {
//       setNewBadge(added);
//       setTimeout(() => setNewBadge(null), 5000);
//     }
//     prevBadgesRef.current = g.badges;
//     setGamification(g);
//   };

//   const handleToggle = async (taskId) => {
//     try {
//       const res = await api.patch(`/tasks/${taskId}/toggle`);
//       const updated = res.data.task;
//       setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
//       setStats((prev) => ({
//         ...prev,
//         completed:
//           updated.status === "completed"
//             ? prev.completed + 1
//             : prev.completed - 1,
//         todo: updated.status === "todo" ? prev.todo + 1 : prev.todo - 1,
//       }));
//       if (res.data.gamification) {
//         applyGamification(res.data.gamification, prevBadgesRef.current);
//         toast.success(`⚡ +10 XP! Total: ${res.data.gamification.xp} XP`);
//       }
//       if (updated.status === "completed") setMoodTask(updated);
//     } catch {
//       toast.error("Failed to update task");
//     }
//   };

//   const handleKanbanMove = async (taskId, newStatus) => {
//     try {
//       const res = await api.patch(`/tasks/${taskId}/kanban`, {
//         status: newStatus,
//       });
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? res.data.task : t)),
//       );
//       if (res.data.gamification) {
//         applyGamification(res.data.gamification, prevBadgesRef.current);
//         toast.success(`⚡ +10 XP!`);
//       }
//       if (newStatus === "completed") setMoodTask(res.data.task);
//       fetchTasks();
//     } catch {
//       toast.error("Failed to move task");
//     }
//   };

//   const handleSubtaskToggle = async (taskId, subtaskId) => {
//     try {
//       const res = await api.patch(
//         `/tasks/${taskId}/subtask/${subtaskId}/toggle`,
//       );
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? res.data.task : t)),
//       );
//     } catch {
//       toast.error("Failed to update subtask");
//     }
//   };

//   const handlePomodoroComplete = async () => {
//     if (!pomodoroTask) return;
//     try {
//       const res = await api.patch(`/tasks/${pomodoroTask._id}/pomodoro`);
//       setTasks((prev) =>
//         prev.map((t) => (t._id === pomodoroTask._id ? res.data.task : t)),
//       );
//       setPomodoroTask((prev) =>
//         prev ? { ...prev, pomodoroCount: (prev.pomodoroCount || 0) + 1 } : null,
//       );
//     } catch {}
//   };

//   const handleAddTask = async (form) => {
//     setModalLoading(true);
//     try {
//       await api.post("/tasks", form);
//       toast.success("Task added! ✅");
//       setShowModal(false);
//       setPage(1);
//       fetchTasks();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add task");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleEditTask = async (form) => {
//     setModalLoading(true);
//     try {
//       await api.put(`/tasks/${editTask._id}`, form);
//       toast.success("Task updated!");
//       setShowModal(false);
//       setEditTask(null);
//       fetchTasks();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update task");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const confirmDelete = (task) => {
//     setDeleteTarget(task);
//     setShowConfirm(true);
//   };

//   const handleDelete = async () => {
//     setModalLoading(true);
//     try {
//       await api.delete(`/tasks/${deleteTarget._id}`);
//       toast.success("Task moved to trash 🗑️");
//       setShowConfirm(false);
//       setDeleteTarget(null);
//       if (tasks.length === 1 && page > 1) setPage((p) => p - 1);
//       else fetchTasks();
//     } catch {
//       toast.error("Failed");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const initials =
//     user?.name
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2) || "U";

//   return (
//     <div className="dashboard-layout">
//       <nav className="navbar">
//         <div className="navbar-brand">
//           Task<span>Flow</span>
//         </div>
//         <div className="navbar-right" style={{ gap: 8 }}>
//           <button
//             className="btn btn-ghost btn-sm"
//             onClick={() => setShowMoodReport(true)}
//             title="Mood Report"
//           >
//             😊
//           </button>
//           <button
//             className="btn btn-ghost btn-sm"
//             onClick={() => setShowTrash(true)}
//             title="Trash"
//           >
//             🗑️
//           </button>
//           <div className="user-chip">
//             <div className="user-avatar">{initials}</div>
//             <span className="user-name">{user?.name}</span>
//           </div>
//           <button className="btn btn-ghost btn-sm" onClick={logout}>
//             Sign Out
//           </button>
//         </div>
//       </nav>

//       <main className="dashboard-main">
//         {/* Stats */}
//         <div
//           className="stats-grid"
//           style={{ gridTemplateColumns: "repeat(4,1fr)" }}
//         >
//           <div className="stat-card total">
//             <div className="stat-value">{stats.total}</div>
//             <div className="stat-label">Total</div>
//             <div className="stat-icon">📋</div>
//           </div>
//           <div
//             className="stat-card"
//             style={{
//               background: "rgba(99,102,241,0.08)",
//               border: "1px solid rgba(99,102,241,0.2)",
//             }}
//           >
//             <div className="stat-value" style={{ color: "var(--accent)" }}>
//               {stats.todo}
//             </div>
//             <div className="stat-label">To Do</div>
//             <div className="stat-icon">🔵</div>
//           </div>
//           <div className="stat-card pending">
//             <div className="stat-value">{stats.inprogress}</div>
//             <div className="stat-label">In Progress</div>
//             <div className="stat-icon">⚡</div>
//           </div>
//           <div className="stat-card completed">
//             <div className="stat-value">{stats.completed}</div>
//             <div className="stat-label">Done</div>
//             <div className="stat-icon">✅</div>
//           </div>
//         </div>

//         {/* Gamification */}
//         <GamificationBar gamification={gamification} newBadge={newBadge} />

//         {/* NLP */}
//         <NLPBar
//           onTaskCreated={() => {
//             setPage(1);
//             fetchTasks();
//           }}
//         />

//         {/* Project Progress */}
//         <ProjectProgress tasks={allTasks.length > 0 ? allTasks : tasks} />

//         {/* Heatmap toggle */}
//         <div style={{ marginBottom: 16 }}>
//           <button
//             className="btn btn-ghost btn-sm"
//             onClick={() => setShowHeatmap((s) => !s)}
//           >
//             {showHeatmap ? "▲" : "▼"} 📊 Activity Heatmap
//           </button>
//           {showHeatmap && (
//             <div
//               style={{
//                 background: "var(--surface)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "var(--radius)",
//                 padding: 16,
//                 marginTop: 8,
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "0.75rem",
//                   color: "var(--text3)",
//                   marginBottom: 10,
//                   textTransform: "uppercase",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 GitHub-style contribution graph
//               </div>
//               <Heatmap data={heatmap} />
//             </div>
//           )}
//         </div>

//         {/* Toolbar */}
//         <div className="toolbar" style={{ flexWrap: "wrap" }}>
//           <div className="search-wrap">
//             <svg
//               className="search-icon"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <circle cx="11" cy="11" r="8" />
//               <path d="M21 21l-4.35-4.35" />
//             </svg>
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search tasks..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//             />
//           </div>
//           <select
//             className="filter-select"
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setPage(1);
//             }}
//           >
//             <option value="all">All Status</option>
//             <option value="todo">To Do</option>
//             <option value="inprogress">In Progress</option>
//             <option value="completed">Completed</option>
//           </select>
//           <select
//             className="filter-select"
//             value={priorityFilter}
//             onChange={(e) => {
//               setPriorityFilter(e.target.value);
//               setPage(1);
//             }}
//           >
//             <option value="all">All Priority</option>
//             <option value="high">🔴 High</option>
//             <option value="medium">🟡 Medium</option>
//             <option value="low">🟢 Low</option>
//           </select>
//           {projects.length > 0 && (
//             <select
//               className="filter-select"
//               value={projectFilter}
//               onChange={(e) => {
//                 setProjectFilter(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="all">All Projects</option>
//               {projects.map((p) => (
//                 <option key={p} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>
//           )}
//           {/* View toggle */}
//           <div
//             style={{
//               display: "flex",
//               gap: 4,
//               background: "var(--bg3)",
//               borderRadius: 8,
//               padding: 3,
//             }}
//           >
//             <button
//               onClick={() => setViewMode("list")}
//               style={{
//                 background:
//                   viewMode === "list" ? "var(--accent)" : "transparent",
//                 border: "none",
//                 borderRadius: 6,
//                 padding: "4px 10px",
//                 cursor: "pointer",
//                 color: viewMode === "list" ? "white" : "var(--text3)",
//                 fontSize: "0.78rem",
//                 transition: "all 0.2s",
//               }}
//             >
//               ≡ List
//             </button>
//             <button
//               onClick={() => setViewMode("kanban")}
//               style={{
//                 background:
//                   viewMode === "kanban" ? "var(--accent)" : "transparent",
//                 border: "none",
//                 borderRadius: 6,
//                 padding: "4px 10px",
//                 cursor: "pointer",
//                 color: viewMode === "kanban" ? "white" : "var(--text3)",
//                 fontSize: "0.78rem",
//                 transition: "all 0.2s",
//               }}
//             >
//               ⊞ Kanban
//             </button>
//           </div>
//           <button
//             className="btn btn-primary"
//             onClick={() => {
//               setEditTask(null);
//               setShowModal(true);
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//             >
//               <path d="M12 5v14M5 12h14" />
//             </svg>
//             Add Task
//           </button>
//         </div>

//         {/* Tasks header */}
//         <div className="tasks-header">
//           <div className="tasks-title">
//             Tasks <span className="task-count-badge">{pagination.count}</span>
//           </div>
//           {(search ||
//             statusFilter !== "all" ||
//             priorityFilter !== "all" ||
//             projectFilter !== "all") && (
//             <button
//               className="btn btn-ghost btn-sm"
//               onClick={() => {
//                 setSearch("");
//                 setStatusFilter("all");
//                 setPriorityFilter("all");
//                 setProjectFilter("all");
//                 setPage(1);
//               }}
//             >
//               Clear ✕
//             </button>
//           )}
//         </div>

//         {loadingTasks ? (
//           <div className="loading-center">
//             <div className="spinner" style={{ width: 36, height: 36 }} />
//           </div>
//         ) : tasks.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">📋</div>
//             <h3>No tasks found</h3>
//             <p>Add your first task or adjust filters</p>
//             <button
//               className="btn btn-primary"
//               style={{ marginTop: 20 }}
//               onClick={() => {
//                 setEditTask(null);
//                 setShowModal(true);
//               }}
//             >
//               + Add Task
//             </button>
//           </div>
//         ) : viewMode === "kanban" ? (
//           <KanbanBoard
//             tasks={tasks}
//             onMove={handleKanbanMove}
//             onEdit={(t) => {
//               setEditTask(t);
//               setShowModal(true);
//             }}
//             onDelete={confirmDelete}
//             onPomodoro={setPomodoroTask}
//             onSubtaskToggle={handleSubtaskToggle}
//           />
//         ) : (
//           <div className="task-list">
//             {tasks.map((task) => (
//               <TaskCard
//                 key={task._id}
//                 task={task}
//                 onToggle={handleToggle}
//                 onEdit={(t) => {
//                   setEditTask(t);
//                   setShowModal(true);
//                 }}
//                 onDelete={confirmDelete}
//                 onPomodoro={setPomodoroTask}
//                 onSubtaskToggle={handleSubtaskToggle}
//               />
//             ))}
//           </div>
//         )}

//         {viewMode === "list" && pagination.total > 1 && (
//           <div className="pagination">
//             <button
//               className="page-btn"
//               onClick={() => setPage((p) => p - 1)}
//               disabled={page === 1}
//             >
//               ‹
//             </button>
//             {Array.from({ length: pagination.total }, (_, i) => i + 1)
//               .filter(
//                 (p) =>
//                   p === 1 || p === pagination.total || Math.abs(p - page) <= 1,
//               )
//               .reduce((acc, p, idx, arr) => {
//                 if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
//                 acc.push(p);
//                 return acc;
//               }, [])
//               .map((p, i) =>
//                 p === "..." ? (
//                   <span
//                     key={`e${i}`}
//                     style={{ color: "var(--text3)", padding: "0 4px" }}
//                   >
//                     …
//                   </span>
//                 ) : (
//                   <button
//                     key={p}
//                     className={`page-btn ${page === p ? "active" : ""}`}
//                     onClick={() => setPage(p)}
//                   >
//                     {p}
//                   </button>
//                 ),
//               )}
//             <button
//               className="page-btn"
//               onClick={() => setPage((p) => p + 1)}
//               disabled={page === pagination.total}
//             >
//               ›
//             </button>
//           </div>
//         )}
//       </main>

//       {/* Modals */}
//       <TaskModal
//         open={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditTask(null);
//         }}
//         onSubmit={editTask ? handleEditTask : handleAddTask}
//         task={editTask}
//         loading={modalLoading}
//       />
//       <ConfirmDialog
//         open={showConfirm}
//         onClose={() => {
//           setShowConfirm(false);
//           setDeleteTarget(null);
//         }}
//         onConfirm={handleDelete}
//         taskTitle={deleteTarget?.title}
//         loading={modalLoading}
//       />
//       {pomodoroTask && (
//         <PomodoroTimer
//           task={pomodoroTask}
//           onComplete={handlePomodoroComplete}
//           onClose={() => setPomodoroTask(null)}
//         />
//       )}
//       {moodTask && (
//         <MoodPicker
//           taskId={moodTask._id}
//           onDone={() => {
//             setMoodTask(null);
//             fetchTasks();
//           }}
//         />
//       )}
//       {showMoodReport && (
//         <MoodReportModal onClose={() => setShowMoodReport(false)} />
//       )}
//       {showTrash && (
//         <TrashPanel
//           onClose={() => setShowTrash(false)}
//           onRestored={fetchTasks}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;
