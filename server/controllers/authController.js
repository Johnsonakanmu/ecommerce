const {User} = require('../../models/index')
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const validatePassword = (password) => {
  // Ensure the password is at least 8 characters long and contains a mix of letters, numbers, and symbols
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};


exports.loginPage = (req, res, next)=>{
    res.render('auth/login', {title: "Login Page | Order Your Jersey",  showSidebar: false });
}


exports.loginPages = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if the user exists in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }

    // Step 2: Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials: Incorrect password' });
    }

    // Step 3: Generate a JWT token
    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '1d' }
    );

    // Step 4: Store the token in a cookie
    res.cookie('authToken', accessToken, { httpOnly: true, secure: false }); // Use secure: true in production with HTTPS

    // Step 5: Store the user ID in the session for session-based management
    req.session.userId = user.id; // Store the user ID in the session

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      },
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
};



// exports.signupPage = async (req, res, next) => {
//   const { email, password, firstName, lastName } = req.body;

//   try {
//     console.log("Request received:", req.body); // Check what is coming in the request body

//     // Look for an existing user by email
//     let user = await User.findOne({ where: { email } });

//     if (user) {
//       // User exists, handle login
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(400).send('Invalid email or password');
//       }

//       // Store userId in session after login
//       req.session.userId = user.id;
//       return res.status(200).send({ message: 'Login successful', user });
//     } else {
//       // User doesn't exist, handle sign-up
//       console.log("Creating a new user...");

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       // Create the user in the database
//       user = await User.create({
//         email,
//         password: hashedPassword,
//         firstName,
//         lastName,
//       });

//       // If the user was not created, handle the error
//       if (!user) {
//         throw new Error("User creation failed");
//       }

//       console.log("User created successfully:", user);

//       // Store userId in session after sign-up
//       req.session.userId = user.id;
//       return res.status(201).send({ message: 'Account created successfully', user });
//     }
//   } catch (err) {
//     console.error("Error during signup or login:", err.message);
//     return res.status(500).send(`Error occurred during authentication: ${err.message}`);
//   }
// };

exports.signupPage = async (req, res, next) => {
  console.log(req.body); // Log request body for debugging
  const { firstName, lastName, email, password } = req.body;

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
      firstName,
      lastName,
      email: normalizedEmail,
      password: encryptedPassword,
    });

    // Step 5: Store the new user ID in the session
    req.session.userId = newUser.id;

    // Step 6: Return a success response, excluding the password
    const { firstName: userFirstName, lastName: userLastName, email: userEmail } = newUser;

    return res.status(201).json({
      message: 'New user created successfully',
      user: { firstName: userFirstName, lastName: userLastName, email: userEmail },
    });

  } catch (error) {
    console.error('Error in signupPage controller:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while processing the request' });
  }
};




exports.resetPassword = (req, res, next)=>{
    res.render('auth/reset_password', {title: "Reset Password | Order Your Jersey" , showSidebar: false });
}