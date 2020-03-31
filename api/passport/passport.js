const passport = require('passport');
const md5 = require('js-md5');
const LocalStrategy = require('passport-local').Strategy;
const configs = require('../configs/config');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const database = require('../adapters/Database');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        // but in our case we gonna use simple email/password from config file
        database
            .getUser(email)
            .then((user) => {
                if (user && user.email === email && user.password === md5(password)) {
                    return cb(null, {email}, {success: true, message: 'Logged In Successfully'});
                } else {
                    return cb(null, false, {success: false, message: 'Incorrect email or password.'});
                }
            });
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: configs.authorization.secret
    },
    ({email}, cb) => {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        // but in our case we gonna use simple email/password from config file
        database
            .getUser(email)
            .then((user) => {
                if (user) {
                    return cb(null, {email});
                } else {
                    return cb('Incorrect email or password.');
                }
            });
    }
));