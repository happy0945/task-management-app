const express = require('express');
const router = express.Router();

const {
  getTasks, createTask, updateTask, deleteTask, permanentDelete, restoreTask,
  toggleTask, moveKanban, toggleSubtask, incrementPomodoro, parseNLTask,
  getAISuggestion, setMood, getMoodReport
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.post('/parse-nl', parseNLTask);
router.get('/mood-report', getMoodReport);

router.route('/:id').put(updateTask).delete(deleteTask);
router.delete('/:id/permanent', permanentDelete);
router.patch('/:id/restore', restoreTask);
router.patch('/:id/toggle', toggleTask);
router.patch('/:id/kanban', moveKanban);
router.patch('/:id/pomodoro', incrementPomodoro);
router.patch('/:id/mood', setMood);
router.patch('/:id/subtask/:subtaskId/toggle', toggleSubtask);
router.get('/:id/suggestion', getAISuggestion);

module.exports = router;
