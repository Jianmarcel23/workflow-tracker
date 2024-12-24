const validateTaskName = (req, res, next) => {
    const { name } = req.body;


    // validasi nama harus ada, berupa string dan panjang 3-100 karakter
    if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
        return res.status(400).json({ message: 'task name must be a between 3-100 characters' });
        }
        next();

        };

        module.exports = { validateTaskName };