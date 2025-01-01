const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Blocked', 'Pending Review','Done'],
        default: 'Todo'
    },
    statusHistory: [
        {
            status: { type: String },
            updatedAt: { type: Date , default: Date.now }
            }
        ],
    labels: [{ type: String }],
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedBy: { type: String }
    }]
});

taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
    });

module.exports = mongoose.model('Task', taskSchema);
