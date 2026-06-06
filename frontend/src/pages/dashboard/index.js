import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import TaskModal from "../../components/TaskModal";
import ConfirmDialog from "../../components/ConfirmDialog";

// Dashboard sub-components
import PomodoroTimer from "./components/PomodoroTimer";
import NLPBar from "./components/NLPBar";
import GamificationBar from "./components/GamificationBar";
import AISuggestion from "./components/AISuggestion";
import SubtaskList from "./components/SubtaskList";
import MoodPicker from "./components/MoodPicker";
import MoodReportModal from "./components/MoodReportModal";
import Heatmap from "./components/Heatmap";
import ProjectProgress from "./components/ProjectProgress";
import TrashPanel from "./components/TrashPanel";
import KanbanBoard from "./components/KanbanBoard";
import TaskCard from "./components/TaskCard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inprogress: 0,
    completed: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
  });
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [gamification, setGamification] = useState(null);
  const [newBadge, setNewBadge] = useState(null);
  const [heatmap, setHeatmap] = useState({});
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [viewMode, setViewMode] = useState("list"); // 'list' | 'kanban'
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showMoodReport, setShowMoodReport] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [pomodoroTask, setPomodoroTask] = useState(null);
  const [moodTask, setMoodTask] = useState(null);

  const prevBadgesRef = useRef([]);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (projectFilter !== "all") params.append("project", projectFilter);
      params.append("page", page);
      params.append("limit", viewMode === "kanban" ? 100 : 8);
      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.tasks);
      setStats(res.data.stats);
      setPagination(res.data.pagination);
      if (res.data.gamification) setGamification(res.data.gamification);
      if (res.data.heatmap) setHeatmap(res.data.heatmap);
      if (res.data.projects) setProjects(res.data.projects);
      // for project progress bar we always need all active tasks
      if (viewMode === "list" && res.data.projects.length > 0) {
        const allRes = await api.get("/tasks?limit=200");
        setAllTasks(allRes.data.tasks);
      }
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  }, [search, statusFilter, priorityFilter, projectFilter, page, viewMode]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const applyGamification = (g, prevBadges) => {
    if (!g) return;
    const added = g.badges.find((b) => !prevBadges.includes(b));
    if (added) {
      setNewBadge(added);
      setTimeout(() => setNewBadge(null), 5000);
    }
    prevBadgesRef.current = g.badges;
    setGamification(g);
  };

  const handleToggle = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/toggle`);
      const updated = res.data.task;
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      setStats((prev) => ({
        ...prev,
        completed:
          updated.status === "completed"
            ? prev.completed + 1
            : prev.completed - 1,
        todo: updated.status === "todo" ? prev.todo + 1 : prev.todo - 1,
      }));
      if (res.data.gamification) {
        applyGamification(res.data.gamification, prevBadgesRef.current);
        toast.success(`⚡ +10 XP! Total: ${res.data.gamification.xp} XP`);
      }
      if (updated.status === "completed") setMoodTask(updated);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleKanbanMove = async (taskId, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/kanban`, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t)),
      );
      if (res.data.gamification) {
        applyGamification(res.data.gamification, prevBadgesRef.current);
        toast.success(`⚡ +10 XP!`);
      }
      if (newStatus === "completed") setMoodTask(res.data.task);
      fetchTasks();
    } catch {
      toast.error("Failed to move task");
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskId) => {
    try {
      const res = await api.patch(
        `/tasks/${taskId}/subtask/${subtaskId}/toggle`,
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t)),
      );
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  const handlePomodoroComplete = async () => {
    if (!pomodoroTask) return;
    try {
      const res = await api.patch(`/tasks/${pomodoroTask._id}/pomodoro`);
      setTasks((prev) =>
        prev.map((t) => (t._id === pomodoroTask._id ? res.data.task : t)),
      );
      setPomodoroTask((prev) =>
        prev ? { ...prev, pomodoroCount: (prev.pomodoroCount || 0) + 1 } : null,
      );
    } catch {}
  };

  const handleAddTask = async (form) => {
    setModalLoading(true);
    try {
      await api.post("/tasks", form);
      toast.success("Task added! ✅");
      setShowModal(false);
      setPage(1);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditTask = async (form) => {
    setModalLoading(true);
    try {
      await api.put(`/tasks/${editTask._id}`, form);
      toast.success("Task updated!");
      setShowModal(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (task) => {
    setDeleteTarget(task);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await api.delete(`/tasks/${deleteTarget._id}`);
      toast.success("Task moved to trash 🗑️");
      setShowConfirm(false);
      setDeleteTarget(null);
      if (tasks.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchTasks();
    } catch {
      toast.error("Failed");
    } finally {
      setModalLoading(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div className="navbar-brand">
          Task<span>Flow</span>
        </div>
        <div className="navbar-right" style={{ gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowMoodReport(true)}
            title="Mood Report"
          >
            😊
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowTrash(true)}
            title="Trash"
          >
            🗑️
          </button>
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Sign Out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Stats */}
        <div
          className="stats-grid"
          style={{ gridTemplateColumns: "repeat(4,1fr)" }}
        >
          <div className="stat-card total">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
            <div className="stat-icon">📋</div>
          </div>
          <div
            className="stat-card"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="stat-value" style={{ color: "var(--accent)" }}>
              {stats.todo}
            </div>
            <div className="stat-label">To Do</div>
            <div className="stat-icon">🔵</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{stats.inprogress}</div>
            <div className="stat-label">In Progress</div>
            <div className="stat-icon">⚡</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Done</div>
            <div className="stat-icon">✅</div>
          </div>
        </div>

        {/* Gamification */}
        <GamificationBar gamification={gamification} newBadge={newBadge} />

        {/* NLP */}
        <NLPBar
          onTaskCreated={() => {
            setPage(1);
            fetchTasks();
          }}
        />

        {/* Project Progress */}
        <ProjectProgress tasks={allTasks.length > 0 ? allTasks : tasks} />

        {/* Heatmap toggle */}
        <div style={{ marginBottom: 16 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowHeatmap((s) => !s)}
          >
            {showHeatmap ? "▲" : "▼"} 📊 Activity Heatmap
          </button>
          {showHeatmap && (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: 16,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text3)",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                GitHub-style contribution graph
              </div>
              <Heatmap data={heatmap} />
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          <div className="search-wrap">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          {projects.length > 0 && (
            <select
              className="filter-select"
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
          {/* View toggle */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "var(--bg3)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            <button
              onClick={() => setViewMode("list")}
              style={{
                background:
                  viewMode === "list" ? "var(--accent)" : "transparent",
                border: "none",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                color: viewMode === "list" ? "white" : "var(--text3)",
                fontSize: "0.78rem",
                transition: "all 0.2s",
              }}
            >
              ≡ List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                background:
                  viewMode === "kanban" ? "var(--accent)" : "transparent",
                border: "none",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                color: viewMode === "kanban" ? "white" : "var(--text3)",
                fontSize: "0.78rem",
                transition: "all 0.2s",
              }}
            >
              ⊞ Kanban
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditTask(null);
              setShowModal(true);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Tasks header */}
        <div className="tasks-header">
          <div className="tasks-title">
            Tasks <span className="task-count-badge">{pagination.count}</span>
          </div>
          {(search ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            projectFilter !== "all") && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setProjectFilter("all");
                setPage(1);
              }}
            >
              Clear ✕
            </button>
          )}
        </div>

        {loadingTasks ? (
          <div className="loading-center">
            <div className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Add your first task or adjust filters</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={() => {
                setEditTask(null);
                setShowModal(true);
              }}
            >
              + Add Task
            </button>
          </div>
        ) : viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            onMove={handleKanbanMove}
            onEdit={(t) => {
              setEditTask(t);
              setShowModal(true);
            }}
            onDelete={confirmDelete}
            onPomodoro={setPomodoroTask}
            onSubtaskToggle={handleSubtaskToggle}
          />
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => {
                  setEditTask(t);
                  setShowModal(true);
                }}
                onDelete={confirmDelete}
                onPomodoro={setPomodoroTask}
                onSubtaskToggle={handleSubtaskToggle}
              />
            ))}
          </div>
        )}

        {viewMode === "list" && pagination.total > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: pagination.total }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === pagination.total || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`e${i}`}
                    style={{ color: "var(--text3)", padding: "0 4px" }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pagination.total}
            >
              ›
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask(null);
        }}
        onSubmit={editTask ? handleEditTask : handleAddTask}
        task={editTask}
        loading={modalLoading}
      />
      <ConfirmDialog
        open={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        taskTitle={deleteTarget?.title}
        loading={modalLoading}
      />
      {pomodoroTask && (
        <PomodoroTimer
          task={pomodoroTask}
          onComplete={handlePomodoroComplete}
          onClose={() => setPomodoroTask(null)}
        />
      )}
      {moodTask && (
        <MoodPicker
          taskId={moodTask._id}
          onDone={() => {
            setMoodTask(null);
            fetchTasks();
          }}
        />
      )}
      {showMoodReport && (
        <MoodReportModal onClose={() => setShowMoodReport(false)} />
      )}
      {showTrash && (
        <TrashPanel
          onClose={() => setShowTrash(false)}
          onRestored={fetchTasks}
        />
      )}
    </div>
  );
};

export default Dashboard;
