exports.loginPage = (req, res, next)=>{
    res.render('auth/login', {title: "Login Page | Order Your Jersey",  showSidebar: false });
}


exports.signupPage = (req, res, next)=>{
    res.render('auth/signup', { title: "Signup Page | Order Your Jersey" , showSidebar: false });
}

exports.resetPassword = (req, res, next)=>{
    res.render('auth/reset_password', {title: "Reset Password | Order Your Jersey" , showSidebar: false });
}