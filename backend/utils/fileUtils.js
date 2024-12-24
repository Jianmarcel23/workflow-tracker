const fs = require('fs');
const path = require('path');

// tentukan lokasi file JSON
const filePath = path.join(__dirname, '../data/tasks.json');

// membaca data dari file JSON
const readTasksFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
        } catch (error) {
            console.error('error reading tasks file: ', error.message);
            return [];
        }
    };

    // menulis data ke file JSON
    const writeTasksToFile = (tasks) => {
        try {
            fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
            } catch (error) {
                console.error('error writing tasks file: ', error.message);
                }
    };

    module.exports = { readTasksFromFile, writeTasksToFile};