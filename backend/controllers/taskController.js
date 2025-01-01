const Task = require('../models/Task');

const taskController = {
    // Fungsi untuk mendapatkan semua task
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fungsi untuk membuat task baru
    createTask: async (req, res) => {
        try {
            const { name, description, dueDate, priority } = req.body;
            const newTask = new Task({
                name,
                description,
                dueDate,
                priority
            });
            await newTask.save();
            res.status(201).json(newTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    
    // Fungsi untuk memperbarui task dan mencatat statusHistory
updateTask: async (req, res) => {
    try {
        const { id } = req.params;
        const { status, updatedBy, ...updates } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Jika status diperbarui, tambahkan ke statusHistory
        if (status && status !== task.status) {
            task.statusHistory.push({
                status,
                updatedAt: new Date(),
                updatedBy: updatedBy || 'System' // Optional: Siapa yang mengubah
            });
        }

        // Perbarui field lainnya
        Object.assign(task, updates, { status });
        await task.save();

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

    // Fungsi untuk menghapus task
    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findByIdAndDelete(id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fungsi untuk menandai task sebagai selesai
    markTaskAsCompleted: async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findByIdAndUpdate(
                id,
                { status: 'Done' },
                { new: true }
            );
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json({ message: 'Task marked as completed', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = taskController;
