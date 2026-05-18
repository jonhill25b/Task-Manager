const router = require('express').Router();
const Task = require('../models/task');
const auth = require('../middleware/authMiddleware'); // Security Checkpoint

// ==========================================
// 1. CREATE: Add a New Task
// POST /api/tasks
// ==========================================
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const newTask = new Task({
      user: req.user.id, // Injected by authMiddleware from the JWT token
      title,
      description,
      status,
      dueDate
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task.', error: err.message });
  }
});

// ==========================================
// 2. READ: Get All Tasks for Logged-In User
// GET /api/tasks
// ==========================================
router.get('/', auth, async (req, res) => {
  try {
    // Find only tasks belonging to this specific user ID
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks.', error: err.message });
  }
});

// ==========================================
// 3. UPDATE: Modify an Existing Task
// PUT /api/tasks/:id
// ==========================================
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // Find the task by URL ID parameters
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Security Verification: Ensure task belongs to the user requesting the change
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied: Unauthorized modification attempt.' });
    }

    // Update the record fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task.', error: err.message });
  }
});

// ==========================================
// 4. DELETE: Erase a Task
// DELETE /api/tasks/:id
// ==========================================
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Security Verification: Ensure task belongs to the user requesting deletion
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied: Unauthorized deletion attempt.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task successfully removed from engine.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task.', error: err.message });
  }
});

module.exports = router;