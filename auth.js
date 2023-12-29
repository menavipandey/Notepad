// auth.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
  (username, password, done) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user.username); // Serialize using username
  });
  
  passport.deserializeUser((username, done) => {
    // Simulating user lookup in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      done(err, user);
    });
  });

module.exports = passport;
