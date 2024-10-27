function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // Assuming you're using a session-based auth system
        return next();
    }
    // Redirect to login if not authenticated
    req.session.message = {
        type: 'warning',
        message: 'You must be logged in to add items to the cart.'
    };
    res.redirect('/login'); // Adjust your login route
}

module.exports = {
    ensureAuthenticated
  };