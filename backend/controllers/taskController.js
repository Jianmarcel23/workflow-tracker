const { v4: uuidv4 } = require('uuid'); // Untuk membuat ID unik
const { readTasksFromFile, writeTasksToFile } = require('../utils/fileUtils'); // Impor dari fileUtils

// Controller untuk mendapatkan semua tugas
const getTasks = (req, res) => {
    try {
        const tasks = readTasksFromFile();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

// Controller untuk menambahkan tugas baru
const addTask = (req, res) => {
    const { name } = req.body;

    try {
        console.log('task name from request', name);

        // Validasi input
        if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 50) {
            return res.status(400).json({ message: 'Task name must be a string with 1-50 characters' });
        }

        // Validasi duplikasi nama
        const tasks = readTasksFromFile();
        const isDuplicate = tasks.some(task => task.name.toLowerCase() === name.toLowerCase());
        if (isDuplicate) {
            return res.status(400).json({ message: 'Task with this name already exists' });
        }

        const newTask = { id: uuidv4(), name: name.trim(), completed: false };
        tasks.push(newTask);

        writeTasksToFile(tasks);

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Failed to add task' });
    }
};

// Controller untuk menghapus tugas
const deleteTask = (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari parameter URL

        // Baca tasks dari file
        const tasks = readTasksFromFile();

        // Filter task berdasarkan ID
        const filteredTasks = tasks.filter(task => task.id !== id);

        // Cek apakah task ditemukan
        if (tasks.length === filteredTasks.length) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Simpan data yang sudah difilter ke file
        writeTasksToFile(filteredTasks);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};

// Controller untuk mengupdate tugas
const updateTask = (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Validasi input apakah 'name' ada dan berupa string
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Task name must be a string' });
        }
        // Validasi panjang karakter 'name'
        if (name.length < 3 || name.length > 50) {
            return res.status(400).json({ message: 'Task name must be between 3 and 50 characters' });
        }

        // Cek apakah task dengan ID tersebut ada
        let tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Validasi duplikasi nama, kecuali task yang sedang diupdate
        const isDuplicate = tasks.some(
            task => task.name.toLowerCase() === name.toLowerCase() && task.id !== id
        );
        if (isDuplicate) {
            return res.status(400).json({ message: 'Task name already exists' });
        }

        // Jika validasi berhasil, update task
        tasks[taskIndex].name = name;
        writeTasksToFile(tasks);

        res.json({ message: 'Task updated successfully', task: tasks[taskIndex] });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};

// Controller untuk menandai task sebagai selesai
const markTaskAsCompleted = (req, res) => {
    try {
        const { id } = req.params;
        let tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ubah status 'completed' menjadi true
        tasks[taskIndex].completed = true;
        writeTasksToFile(tasks);

        res.json({ message: 'Task marked as completed', task: tasks[taskIndex] });
    } catch (error) {
        console.error('Error marking task as completed:', error);
        res.status(500).json({ message: 'Failed to mark task as completed', error: error.message });
    }
};

module.exports = { getTasks, addTask, deleteTask, updateTask, markTaskAsCompleted };
