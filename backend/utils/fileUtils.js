const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/tasks.json');

const readTasksFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Error reading tasks file:', error.message);
        return []; // Fallback jika file rusak atau tidak ada
    }
};

const writeTasksToFile = (tasks) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error writing tasks file:', error.message);
        throw error; // Lempar error agar controller dapat menangani
    }
};

module.exports = { readTasksFromFile, writeTasksToFile };
