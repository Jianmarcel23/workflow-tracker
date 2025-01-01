const express = require('express');
const connectToDatabase = require('./database');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke database
connectToDatabase();

// Routes
app.use('/tasks', taskRoutes);

// Middleware untuk handling error 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
