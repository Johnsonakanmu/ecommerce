const {User} = require('../../models/index')
const bcrypt = require("bcryptjs");

async function encriptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

exports.loginPage = (req, res, next)=>{
    res.render('auth/login', {title: "Login Page | Order Your Jersey",  showSidebar: false });
}




exports.loginPages = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (user && user.password === password) {
      // Assuming a plain text password for demo; consider using bcrypt for hashing
      res.redirect('product/index'); // Redirect to the dashboard on successful login
    } else {
      // Render the login page again with an error message
      res.render('product/index', { 
        title: "Login Page | Order Your Jersey",  
        showSidebar: true, 
        error: 'Invalid email or password' 
      });
    }
  } catch (err) {
    console.error("Error during login:", err); // Log the error for better debugging
    res.status(500).send('Internal server error');
  }
};



exports.signupPage = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Encrypt password before using it
    const encryptedPassword = await encriptPassword(password);

    // Check if user exists based on email or create a new one
    let [user, created] = await User.findOrCreate({
      where: { email },  // Use email for lookup
      defaults: { firstName, lastName, email, password: encryptedPassword }
    });

    if (created) {
      return res.status(201).json({
        message: 'New user created',
        user: user,
        title: "Signup Page | Order Your Jersey",
      });
    } else {
      return res.status(200).json({
        message: 'User already exists',
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};



exports.resetPassword = (req, res, next)=>{
    res.render('auth/reset_password', {title: "Reset Password | Order Your Jersey" , showSidebar: false });
}