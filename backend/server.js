const express = require('express');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3000;

// Middleware

app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Workflow Tracker API');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Workflow Tracker backend is running on http://localhost:${PORT}`);
});
