// Load environment variables di awal file
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON - PENTING: ini harus ada sebelum routes
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas.');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });

// Routes
app.use('/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});