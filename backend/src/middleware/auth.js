const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    } else {
        req.flash('error_msg', 'Du har ikke tilgang.');
        res.redirect('/');
    }
};

module.exports = {
    isAuthenticated,
    isAdmin
};
