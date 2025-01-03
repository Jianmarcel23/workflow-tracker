const { body, query, validationResult } = require('express-validator');

// Fungsi helper untuk menangani hasil validasi
const handleValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'Validation error'
        });
    }
    next();
};

// Validasi untuk membuat task baru
const validateCreateTask = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Nama task harus antara 1-50 karakter'),
    
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority harus Low, Medium, atau High'),
    
    body('status')
        .optional()
        .isIn(['Todo', 'In Progress', 'Blocked', 'Pending Review', 'Done'])
        .withMessage('Status tidak valid'),
    
    handleValidationResult    // Penting: ini harus berupa fungsi
];

// Validasi untuk mengupdate task
const validateUpdateTask = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Nama task harus antara 1-50 karakter'),
    
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority harus Low, Medium, atau High'),
    
    body('status')
        .optional()
        .isIn(['Todo', 'In Progress', 'Blocked', 'Pending Review', 'Done'])
        .withMessage('Status tidak valid'),
    
    handleValidationResult    // Penting: ini harus berupa fungsi
];

module.exports = {
    validateCreateTask,
    validateUpdateTask
};