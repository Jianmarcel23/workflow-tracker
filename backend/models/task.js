const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Nama task harus diisi'],
        trim: true,
        maxlength: [50, 'Nama task tidak boleh lebih dari 50 karakter']
    },
    description: { 
        type: String,
        trim: true 
    },
    dueDate: { 
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value >= new Date();
            },
            message: 'Tanggal deadline tidak boleh di masa lalu'
        }
    },
    priority: { 
        type: String, 
        enum: {
            values: ['Low', 'Medium', 'High'],
            message: 'Priority harus Low, Medium, atau High'
        },
        default: 'Medium',
        index: true
    },
    // Perbaikan pada definisi status
    status: {
        type: String,
        enum: {
            values: ['Todo', 'In Progress', 'Blocked', 'Pending Review', 'Done'],
            message: 'Status tidak valid'
        },
        default: 'Todo',
        index: true
    },
    statusHistory: [{
        // Perbaikan pada definisi status di dalam statusHistory
        status: { 
            type: String,
            enum: ['Todo', 'In Progress', 'Blocked', 'Pending Review', 'Done'],
            required: true 
        },
        updatedBy: { 
            type: String, 
            required: true 
        },
        updatedAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
    labels: [{ 
        type: String,
        trim: true,
        lowercase: true
    }],
    createdAt: { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Virtual untuk menghitung durasi task
taskSchema.virtual('duration').get(function() {
    if (!this.dueDate) return null;
    return Math.ceil((this.dueDate - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
taskSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Method untuk menambahkan status history
taskSchema.methods.addStatusHistory = function(status, updatedBy) {
    this.statusHistory.push({
        status,
        updatedBy,
        updatedAt: new Date()
    });
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;