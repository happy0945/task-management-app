import React, { useState, useEffect } from 'react';

const TaskModal = ({ open, onClose, onSubmit, task, loading }) => {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', subtasks: [], project: '' });
  const [errors, setErrors] = useState({});
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        subtasks: task.subtasks || [],
        project: task.project || ''
      });
    } else {
      setForm({ title: '', description: '', priority: 'medium', dueDate: '', subtasks: [], project: '' });
    }
    setErrors({});
    setNewSubtask('');
  }, [task, open]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    else if (form.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) errs.description = 'Description cannot exceed 500 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setForm(prev => ({ ...prev, subtasks: [...prev.subtasks, { title: newSubtask.trim(), completed: false }] }));
    setNewSubtask('');
  };

  const removeSubtask = (idx) => setForm(prev => ({ ...prev, subtasks: prev.subtasks.filter((_, i) => i !== idx) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <span className="modal-title">{task ? '✏️ Edit Task' : '➕ Add New Task'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input name="title" type="text" className={`form-input ${errors.title ? 'error' : ''}`} placeholder="What needs to be done?" value={form.title} onChange={handleChange} autoFocus />
            {errors.title && <div className="form-error">⚠ {errors.title}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className={`form-input ${errors.description ? 'error' : ''}`} placeholder="Add more details (optional)..." value={form.description} onChange={handleChange} rows={3} />
            {errors.description && <div className="form-error">⚠ {errors.description}</div>}
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4, textAlign: 'right' }}>{form.description.length}/500</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-input" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input name="dueDate" type="date" className="form-input" value={form.dueDate} onChange={handleChange} min={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">📁 Project (optional)</label>
            <input name="project" type="text" className="form-input" placeholder='e.g. "Internship Prep", "Personal"' value={form.project} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Subtasks / Checklist</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="text" className="form-input" placeholder="Add a step..." value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())} style={{ flex: 1 }} />
              <button type="button" className="btn btn-primary btn-sm" onClick={addSubtask} style={{ whiteSpace: 'nowrap' }}>+ Add</button>
            </div>
            {form.subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {form.subtasks.map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text3)', minWidth: 18 }}>{i + 1}.</span>
                    <span style={{ flex: 1, fontSize: '0.85rem' }}>{st.title}</span>
                    <button type="button" onClick={() => removeSubtask(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 13 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" />{task ? 'Saving...' : 'Adding...'}</> : task ? '✓ Save Changes' : '+ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
