// routes/debug.js
const express = require('express');
const Task = require('../models/Task');
const logger = require('../utils/logger');
const router = express.Router();

// Hanya aktif jika dalam mode development
if (process.env.NODE_ENV === 'development') {
    router.get('/tasks-stats', async (req, res) => {
        try {
            const stats = await Task.aggregate([
                {
                    $group: {
                        _id: null,
                        totalTasks: { $sum: 1 },
                        statusCounts: { 
                            $push: { 
                                status: "$status",
                                count: 1
                            }
                        },
                        averageTasksPerDay: {
                            $avg: {
                                $subtract: ["$updatedAt", "$createdAt"]
                            }
                        }
                    }
                }
            ]);

            res.json({
                statistics: stats[0],
                message: 'Debug information retrieved successfully'
            });
        } catch (error) {
            logger.error('Debug endpoint error', error);
            res.status(500).json({ error: error.message });
        }
    });
}

module.exports = router;