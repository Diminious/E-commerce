import express  from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
// import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import './strategies/local-strategy.js'; // Import local strategy for Passport.js
import connectPgSimple from 'connect-pg-simple';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const pgStore = connectPgSimple(session);

// Passport.js setup
// const initialisePassport = require('./configs/passport-config');
// initialisePassport(passport);


// bodyParser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hour in milliseconds
    }
}))
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(routes);

app.get('/', (req, res) => {
    req.session.visited = true;
    res.send(`Welcome to the E-commerce server: ${req.sessionID}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});