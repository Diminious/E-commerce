const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries');

const strategy = new LocalStrategy(function verify(username, password, done) {
    db.authenticateUser("SELECT * FROM users WHERE username = $1", [username], (error, user) => {
        console.log("LocalStrategy called");
        console.log("User found:", user);
        
        if (error) return done(error);
        if (!user) return done(null, false , { message: 'Incorrect username or password' });
        if (user.password !== password) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
});

const initialise = (passport) => {
    passport.use(strategy);

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((user, done) => {
        db.getUserById(user.id);
        done(null, user);
    });

}

module.exports = initialise;