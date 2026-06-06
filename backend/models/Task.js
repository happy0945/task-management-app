const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({

  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
}, { _id: true });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'completed', 'archived'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  project: {
    type: String,
    trim: true,
    default: ''
  },
  dueDate: { 
    type: Date, 
    default: null 
  },
  subtasks: [subtaskSchema],
  
  pomodoroCount: { 
    type: Number, 
    default: 0 
  },
  mood: { 
    type: String, 
    enum: ['great', 'okay', 'tired', null], 
    default: null 
  },
  completedAt: { 
    type: Date, 
    default: null 
  },
  deletedAt: { 
    type: Date, 
    default: null 
  },
  kanbanOrder: { 
    type: Number, 
    default: 0 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, project: 1 });

module.exports = mongoose.model('Task', taskSchema);
