const {User} = require('../../models/index')
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const {Cart} = require('../../models/index')

const validatePassword = (password) => {
  // Ensure the password is at least 8 characters long and contains a mix of letters, numbers, and symbols
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};


exports.signupPage = async (req, res, next) => {
  console.log(req.body); // Log request body for debugging
  const { fullName, email, password } = req.body;

  try {
    // Normalize email to lower case
    const normalizedEmail = email.toLowerCase();

    // Step 1: Check if the email already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        userExists: true,
        user: {
          id: existingUser.id,
        },
      });
    }

    // Step 2: Validate password complexity
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain letters, numbers, and special characters (@$!%*#?&).',
        passwordValid: false,
      });
    }

    // Step 3: Encrypt the password using bcrypt
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    // Step 4: Create a new user WITHOUT the createdBy field
    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: encryptedPassword,
    });

    // Step 5: Store the new user ID in the session
    req.session.userId = newUser.id;

    // Step 6: Return a success response, excluding the password
    const {fullName: usefullName,  email: userEmail } = newUser;

    return res.status(201).json({
      message: 'New user created successfully',
      user: { fullName: usefullName, email: userEmail },
    });

  } catch (error) {
    console.error('Error in signupPage controller:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while processing the request' });
  }
};


exports.resetPassword = (req, res, next)=>{
    res.render('auth/reset_password', {title: "Reset Password | Order Your Jersey" , showSidebar: false });
}

// Login function
exports.getLoginAccount = (req, res, next)=>{
  res.render('auth/login', {
      title: "Login Page | Order Your Jersey",  
      errors: {},  
       email: '',
      showSidebar: false 
    });
}
exports.loginAccount = async (req, res, next) => {
  const { email, password } = req.body;

  try {

     // Retrieve cart items by session ID
     const cartItems = await Cart.getItemsBySessionId(req.sessionID);

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // If user not found, return specific error
      return res.render('auth/login', {
        errors: { general: 'You have not created an account or your email is not found in the database.' },
        email,
        showSidebar: false,
      });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If password doesn't match, return error
      return res.render('auth/login', {
        errors: { password: 'Incorrect password' },
        email,
        showSidebar: false,
      });
    }

    if (cartItems.length === 0) {
      return res.render('auth/login', {
        errors: { cart: 'No items found in the cart' },
        email,
        showSidebar: false,
      });
    }

    // Set user session after successful login
    req.session.user = user;
    req.session.userId = user.id;

    // Update the cart with the user's ID
    await Cart.updateUserIdBySessionId(req.sessionID, user.id);

    // Redirect to payment page after login
    return res.redirect('/confirmation_page');
  } catch (err) {
    console.error('Error during login:', err);
    res.render('auth/login', {
      errors: { general: 'An error occurred. Please try again.' },
      email,
      showSidebar: false,
    });
  }
};


