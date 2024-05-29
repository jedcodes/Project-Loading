export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

export const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};
