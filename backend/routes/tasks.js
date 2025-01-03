const express = require('express');
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Pastikan middleware validasi diberikan sebagai array
router.get('/', taskController.getAllTasks);
router.post('/', validateCreateTask, taskController.createTask);
router.put('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/completed', taskController.markTaskAsCompleted);

module.exports = router;