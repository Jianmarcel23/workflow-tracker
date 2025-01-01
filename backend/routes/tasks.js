const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Route untuk mendapatkan semua tugas
router.get('/', taskController.getAllTasks);

// Route untuk menambahkan tugas baru
router.post('/', taskController.createTask);

// Route untuk memperbarui tugas
router.put('/:id', taskController.updateTask);

// Route untuk menghapus tugas
router.delete('/:id', taskController.deleteTask);

// Route untuk menandai tugas sebagai selesai
router.patch('/:id/completed', taskController.markTaskAsCompleted);

module.exports = router;
