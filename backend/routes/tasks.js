const express = require('express');
const { getTasks, addTask, deleteTask, updateTask, markTaskAsCompleted } = require('../controllers/taskController');
const { validateTaskName } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Route untuk mendapatkan semua tugas
router.get('/', getTasks);

// Route untuk menambahkan tugas baru (dengan validasi)
router.post('/', validateTaskName, addTask);

// Route untuk menghapus tugas
router.delete('/:id', deleteTask);

// Route untuk mengupdate tugas (dengan validasi)
router.put('/:id', validateTaskName, updateTask);

// Route untuk menandai task sebagai selesai
router.patch('/:id/completed', markTaskAsCompleted);

module.exports = router;
