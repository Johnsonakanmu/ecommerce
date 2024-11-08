const isAdminAuthentication = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return next(); // Proceed if logged in
    }
    res.redirect('/sign_in'); // Redirect to sign-in page if not logged in
};

module.exports = { isAdminAuthentication };