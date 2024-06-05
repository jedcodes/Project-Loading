import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user.js';

// Section: Local Strategy for User
/**
 * Local strategy for authenticating users based on username
 */
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        // Password is not needed for user login, just check username
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Section: Serialize User
/**
 * Serialize user information into the session
 * @param {Object} user - The user object
 * @param {Function} done - The done callback
 */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Section: Deserialize User
/**
 * Deserialize user information from the session
 * @param {String} id - The user ID
 * @param {Function} done - The done callback
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
