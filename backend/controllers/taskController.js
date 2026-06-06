const Task = require('../models/Task');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleGamification = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  user.xp = (user.xp || 0) + 10;
  user.totalCompleted = (user.totalCompleted || 0) + 1;
  if (user.lastActiveDate === yesterdayStr) user.streak = (user.streak || 0) + 1;
  else if (user.lastActiveDate !== todayStr) user.streak = 1;
  user.lastActiveDate = todayStr;
  const badges = new Set(user.badges || []);
  const hour = new Date().getHours();
  if (hour < 8) badges.add('Early Bird');
  if (hour >= 22) badges.add('Night Owl');
  if (user.streak >= 7) badges.add('Week Warrior');
  if (user.streak >= 30) badges.add('Marathoner');
  if (user.totalCompleted >= 50) badges.add('Task Master');
  if (user.totalCompleted >= 10) badges.add('Getting Started');
  user.badges = Array.from(badges);
  await user.save();
  return user;
};


const getTasks = async (req, res) => {
  try {
    const { search, status, priority, project, page = 1, limit = 50, sort = '-createdAt', view = 'list' } = req.query;
    const query = { userId: req.user._id };

  
    if (status === 'archived') {
      query.status = 'archived';
    } else if (status === 'trash') {
      query.deletedAt = { $ne: null };
    } else {
      query.deletedAt = null;
      if (status && status !== 'all') query.status = status;
      else query.status = { $in: ['todo', 'inprogress', 'completed'] };
    }

    if (priority && priority !== 'all') query.priority = priority;
    if (project && project !== 'all') query.project = project;
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(limitNum),
      Task.countDocuments(query)
    ]);

    const activeQuery = { userId: req.user._id, deletedAt: null };
    const [totalAll, todoCount, inprogressCount, completedCount] = await Promise.all([
      Task.countDocuments({ ...activeQuery, status: { $in: ['todo','inprogress','completed'] } }),
      Task.countDocuments({ ...activeQuery, status: 'todo' }),
      Task.countDocuments({ ...activeQuery, status: 'inprogress' }),
      Task.countDocuments({ ...activeQuery, status: 'completed' })
    ]);

    
    const projects = await Task.distinct('project', { userId: req.user._id, deletedAt: null, project: { $ne: '' } });

    
    const twelveWeeksAgo = new Date(); twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    const heatmapTasks = await Task.find({
      userId: req.user._id,
      status: 'completed',
      completedAt: { $gte: twelveWeeksAgo }
    }).select('completedAt');
    const heatmap = {};
    heatmapTasks.forEach(t => {
      if (t.completedAt) {
        const d = t.completedAt.toISOString().slice(0, 10);
        heatmap[d] = (heatmap[d] || 0) + 1;
      }
    });

    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      tasks,
      pagination: { current: pageNum, total: Math.ceil(total / limitNum), count: total, limit: limitNum },
      stats: { total: totalAll, todo: todoCount, inprogress: inprogressCount, completed: completedCount },
      gamification: { xp: user.xp, streak: user.streak, badges: user.badges, totalCompleted: user.totalCompleted },
      projects,
      heatmap
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};


const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, subtasks, project } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ success: false, message: 'Task title is required' });
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      subtasks: subtasks || [],
      project: project ? project.trim() : '',
      userId: req.user._id
    });
    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};


const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const { title, description, status, priority, dueDate, subtasks, pomodoroCount, project } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (subtasks !== undefined) task.subtasks = subtasks;
    if (pomodoroCount !== undefined) task.pomodoroCount = pomodoroCount;
    if (project !== undefined) task.project = project.trim();
    await task.save();
    res.json({ success: true, message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.deletedAt = new Date();
    task.status = 'archived';
    await task.save();
    res.json({ success: true, message: 'Task moved to trash' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};


const permanentDelete = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Task permanently deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed' });
  }
};


const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.deletedAt = null;
    task.status = 'todo';
    await task.save();
    res.json({ success: true, message: 'Task restored', task });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to restore task' });
  }
};


const moveKanban = async (req, res) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const wasCompleted = task.status === 'completed';
    task.status = status;
    if (order !== undefined) task.kanbanOrder = order;

    let gamification = null;
    if (status === 'completed' && !wasCompleted) {
      task.completedAt = new Date();
      const updatedUser = await handleGamification(req.user._id);
      if (updatedUser) gamification = { xp: updatedUser.xp, streak: updatedUser.streak, badges: updatedUser.badges, totalCompleted: updatedUser.totalCompleted };
    } else if (status !== 'completed') {
      task.completedAt = null;
    }

    await task.save();
    res.json({ success: true, task, gamification });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to move task' });
  }
};


const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const wasCompleted = task.status === 'completed';
    task.status = wasCompleted ? 'todo' : 'completed';
    task.completedAt = wasCompleted ? null : new Date();
    await task.save();
    let gamification = null;
    if (!wasCompleted) {
      const updatedUser = await handleGamification(req.user._id);
      if (updatedUser) gamification = { xp: updatedUser.xp, streak: updatedUser.streak, badges: updatedUser.badges, totalCompleted: updatedUser.totalCompleted };
    }
    res.json({ success: true, task, gamification });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to toggle task' });
  }
};


const setMood = async (req, res) => {
  try {
    const { mood } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { mood },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to set mood' });
  }
};


const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) 
      return res.status(404).json({ success: false, message: 'Task not found' });

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) 
      return res.status(404).json({ success: false, message: 'Subtask not found' });

    subtask.completed = !subtask.completed;
    await task.save();

    res.json({ success: true, task });

  } catch {
    res.status(500).json({ success: false, message: 'Failed to toggle subtask' });
  }
};


const incrementPomodoro = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $inc: { pomodoroCount: 1 } },
      { new: true }
    );
    if (!task) 
      return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });

  } catch {
    res.status(500).json({ success: false, message: 'Failed' });
  }
};

// POST /api/tasks/parse-nl
const parseNLTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) 
      return res.status(400).json({ success: false, message: 'Text is required' });

    let title = text;
    let priority = 'medium';
    let dueDate = null;
    let project = '';
    if (/high priority|urgent|asap|important/i.test(text)) 
      priority = 'high';

    else if (/low priority|sometime|whenever/i.test(text)) 
      priority = 'low';

    title = title.replace(/\b(high|low|medium)\s*priority\b/gi, '').trim();

    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 7);

    if (/\btoday\b/i.test(text)) { 
      dueDate = now.toISOString().slice(0, 10); 
      title = title.replace(/\btoday\b/gi, '').trim(); 
    }

    else if (/\btomorrow\b/i.test(text)) { 
      dueDate = tomorrow.toISOString().slice(0, 10); 
      title = title.replace(/\btomorrow\b/gi, '').trim(); 
    }
    else if (/\bnext week\b/i.test(text)) { 
      dueDate = nextWeek.toISOString().slice(0, 10); 
      title = title.replace(/\bnext week\b/gi, '').trim(); 
    }
    const projectMatch = text.match(/\bfor\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:today|tomorrow|next|high|low|by|at|$))/);

    if (projectMatch)
      project = projectMatch[1].trim();

    const timeMatch = text.match(/\bat\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);

    if (timeMatch) 
      title = title.replace(timeMatch[0], '').trim();

    title = title.replace(/\s{2,}/g, ' ').replace(/^[,\s]+|[,\s]+$/g, '').trim();
    if (!title) 
      title = text;

    res.json({ success: true, parsed: { title, priority, dueDate, project } });

  } catch {
    res.status(500).json({ success: false, message: 'Failed to parse task' });
  }
};

// GET /api/tasks/:id/suggestion

const getAISuggestion = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    const context = `
      Task: "${task.title}"
      ${task.description ? `Description: "${task.description}"` : ""}
      Priority: ${task.priority}
      ${task.dueDate ? `Due: ${new Date(task.dueDate).toDateString()}` : ""}
      ${task.subtasks?.length > 0 ? `Subtasks: ${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} done` : ""}
      Current time: ${new Date().toLocaleTimeString()}
    `.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // free tier

    const result = await model.generateContent(
      `You are a productivity assistant. Based on this task info, give ONE short actionable tip (max 15 words, use 1 emoji). Be specific to the task.\n\n${context}\n\nReply with just the tip, nothing else.`
    );

    const suggestion = result.response.text().trim();
    res.json({ success: true, suggestion });
  } catch (err) {
    console.error("AI suggestion error:", err);
    res.status(500).json({ success: false, message: "Failed to get suggestion" });
  }
};

// GET /api/tasks/mood-report
const getMoodReport = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, status: 'completed', mood: { $ne: null } });
    const report = { great: 0, okay: 0, tired: 0 };

    tasks.forEach(t => { 
      if (t.mood) report[t.mood] = (report[t.mood] || 0) + 1; });
    const total = tasks.length;
    res.json({ success: true, report, total });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get mood report' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, permanentDelete, restoreTask, toggleTask, moveKanban, toggleSubtask, incrementPomodoro, parseNLTask, getAISuggestion, setMood, getMoodReport };
