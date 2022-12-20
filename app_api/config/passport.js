// we are using the localstrategy of passport to authenticate users
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');

// Configure a strategy, to be used during login
passport.use(new LocalStrategy({
    usernameField: 'email' // change passport's default 'username' field to 'email'
},
    async (username, password, done) => {
        try {
            let user = await User.findOne({ email: username });

            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            user.lastAccess = new Date();
            console.log(user.lastAccess);
            user.save((err, users) => {
                if (err) {
                    return null;
                } else {
                    return done(null, user);
                }
            });
        }
        catch (err) { return done(err); }
    }
));