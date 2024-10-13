require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port =  4000;
const {sequelize} = require('./models');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const {User} = require('./models/index')



// Use cookie-parser middleware
app.use(cookieParser());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(methodOverride('_method'));
app.use(express.static('public'));
// app.use(morgan('combined'));
app.use(expressLayouts);
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret_key', // Use environment variable
  saveUninitialized: false, // Do not save uninitialized sessions
  resave: false, // Only save sessions that have been modified
  cookie: { 
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 // Optional: set cookie expiration time (1 day)
  }
}));

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


app.use((req, res, next) => {
    if (!req.session.userId) {
      req.session.userId = Date.now(); // Or any other unique value generation
    }
    next();
  });

 
  app.use(async (req, res, next) => {
    try {
      // Check if user exists in the session
      if (req.session && req.session.userId) {
        // Try to find the user based on session's userId
        const user = await User.findByPk(req.session.userId);
        if (user) {
          req.user = user;  // If user found, attach it to the request object
          return next();    // Proceed to the next middleware
        }
      }
  
      // If no user in session or user not found, create a new user
      const newUser = await User.create({
        firstName: 'Guest',   // You can customize this part with default values or generate dynamically
        lastName: 'User',
        email: 'guest@example.com',
      });
  
      // Save the new user to the session
      req.session.userId = newUser.id;
  
      // Attach the new user to the request object
      req.user = newUser;
  
      // Proceed to the next middleware
      next();
    } catch (err) {
      console.log(err);
      next(err);  // Pass the error to the next middleware (error handler)
    }
  });
  
  
  
  
  
  


app.use(express.static('uploads'))

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


const productRoutes = require('./server/routes/productRoute')
const authRoutes = require('./server/routes/authRoute')
const itemRoutes = require('./server/routes/itemRoute')
// const categoryRoutes = require('./server/routes/catergoryRoute');


app.use('/', productRoutes);
app.use('/', authRoutes)
app.use('/', itemRoutes);
// app.use('/', categoryRoutes)



app.listen({port: 4000}, async () => {
    console.log(`Server up on http://localhost:${port}`);
    await sequelize.authenticate()
    console.log("Database Connected!")
});

