const Task = require('../models/Task');

const taskController = {
    // Modifikasi fungsi getAllTasks untuk mendukung filter dan sorting
    getAllTasks: async (req, res) => {
        try {
            // Mengambil parameter query dari request
            const { status, priority, sort, labels } = req.query;
            
            // Membangun query filter
            let query = {};
            
            // Filter berdasarkan status jika ada
            if (status) {
                // Memastikan status valid sesuai enum yang ada
                if (['Todo', 'In Progress', 'Blocked', 'Pending Review', 'Done'].includes(status)) {
                    query.status = status;
                }
            }
            
            // Filter berdasarkan priority jika ada
            if (priority) {
                // Memastikan priority valid sesuai enum yang ada
                if (['Low', 'Medium', 'High'].includes(priority)) {
                    query.priority = priority;
                }
            }
            
            // Filter berdasarkan labels jika ada
            if (labels) {
                // Labels bisa dipisahkan dengan koma untuk multiple labels
                const labelArray = labels.split(',');
                query.labels = { $in: labelArray };
            }
            
            // Membangun sort options
            let sortOption = {};
            if (sort) {
                // Format sort bisa 'createdAt' atau '-createdAt' (untuk descending)
                // Contoh: sort=createdAt (ascending) atau sort=-createdAt (descending)
                const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
                const sortOrder = sort.startsWith('-') ? -1 : 1;
                
                // Hanya mengizinkan sorting berdasarkan field tertentu
                if (['createdAt', 'dueDate', 'priority'].includes(sortField)) {
                    sortOption[sortField] = sortOrder;
                }
            } else {
                // Default sort berdasarkan createdAt descending
                sortOption.createdAt = -1;
            }
            
            // Eksekusi query dengan filter dan sorting
            const tasks = await Task.find(query)
                                 .sort(sortOption)
                                 .exec();
            
            // Menambahkan metadata pada response
            const response = {
                total: tasks.length,
                filters: {
                    status: status || 'all',
                    priority: priority || 'all',
                    labels: labels ? labels.split(',') : 'all'
                },
                sorting: sort || 'createdAt',
                data: tasks
            };
            
            res.json(response);
        } catch (error) {
            res.status(500).json({ 
                error: error.message,
                message: 'Gagal mengambil data tasks'
            });
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
            console.log('Adding status history:', { status, updatedBy }); // Untuk debugging
            
            task.statusHistory.push({
                status: status,
                updatedBy: updatedBy,
                updatedAt: new Date()
            });
            
            task.status = status;
        }

       
        // Update field lainnya
        Object.assign(task, updates);
        
        // Simpan perubahan
        const updatedTask = await task.save();
        
        res.json({
            message: 'Task updated successfully',
            task: updatedTask,
            statusUpdated: status !== undefined,
            updatedByUser: updatedBy
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
