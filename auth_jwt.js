var passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy;
var extractJWT = require('passport-jwt').ExtractJwt;

var options = {};
options.jwtFromRequest = extractJWT.fromAuthHeaderWithScheme("jwt");
options.secretOrKey = process.env.SECRET_KEY;

passport.use(new JWTStrategy(options,
    function(jwt_payload, done) {
        var user = db.find(jwt_payload.id);
        if(user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
));

exports.isAuthenticated = passport.authenticate('jwt', {session: false});
exports.secret = options.secretOrKey;