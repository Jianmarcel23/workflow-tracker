const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://jianmarcelhamonangan:xhqM8R938JXjJBMA@cluster0.ex1h2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit jika koneksi gagal
    }
};

module.exports = connectToDatabase;
