var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, done) {
        var user = { name: 'cu_user' } //using this instead of a database because this code isn't actually intended for serious use
        if(username === user.name && password === 'passwd') {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
));

exports.isAuthenticated = passport.authenticate('basic', {session: false});