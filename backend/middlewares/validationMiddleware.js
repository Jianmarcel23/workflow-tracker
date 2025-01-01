const validateTaskName = (req, res, next) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 50) {
        return res.status(400).json({ message: 'Task name must be a string with 1-50 characters' });
    }
    next();
};

module.exports = { validateTaskName };
