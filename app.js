
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
const cookieParser = require('cookie-parser')



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
    secret: 'my secret Key',
    saveUninitialized: true,
    resave: false,
    cookie: {secure: process.env.NODE_ENV === 'production' }
})
);

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

app.use(express.static('uploads'))

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


const productRoutes = require('./server/routes/productRoute')
const authRoutes = require('./server/routes/authRoute')
const itemRoutes = require('./server/routes/itemRoute')


app.use('/', productRoutes);
app.use('/', authRoutes)
app.use('/', itemRoutes);



app.listen({port: 4000}, async () => {
    console.log(`Server up on http://localhost:${port}`);
    await sequelize.authenticate()
    console.log("Database Connected!")
});

