var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var local = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
}, function(username, password, done) {
    console.log('Checking '+username+' and '+password);
    return done(null, true);
});

passport.use(local);

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, {"username": username});
});

module.exports = passport;
