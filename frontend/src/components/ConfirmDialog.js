import React from 'react';

const ConfirmDialog = ({ open, onClose, onConfirm, taskTitle, loading }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-dialog" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <span className="modal-title">🗑️ Delete Task</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="task-name-preview">{taskTitle}</div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="spinner" />Deleting...</> : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
