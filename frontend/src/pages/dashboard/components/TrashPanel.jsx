import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const TrashPanel = ({ onClose, onRestored }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks?status=trash&limit=50")
      .then((r) => setItems(r.data.tasks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const restore = async (id) => {
    await api.patch(`/tasks/${id}/restore`);
    setItems((p) => p.filter((t) => t._id !== id));
    toast.success("Task restored! ↩️");
    onRestored();
  };

  const perm = async (id) => {
    await api.delete(`/tasks/${id}/permanent`);
    setItems((p) => p.filter((t) => t._id !== id));
    toast("Task permanently deleted");
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <span className="modal-title">🗑️ Trash (30-day)</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ padding: "8px 0", maxHeight: 400, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: "center" }}>
              <div className="spinner" />
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                color: "var(--text3)",
                textAlign: "center",
                padding: 30,
              }}
            >
              Trash is empty 🎉
            </div>
          ) : (
            items.map((t) => (
              <div
                key={t._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 4px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text)",
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
                    Deleted {new Date(t.deletedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => restore(t._id)}
                >
                  ↩ Restore
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => perm(t._id)}
                >
                  ✕ Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashPanel;
