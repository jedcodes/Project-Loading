import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// Section: Local Strategy for User
/**
 * Local strategy for authenticating users based on username
 */
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            // Check for hardcoded admin credentials
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
                const admin = {
                    id: 'admin',
                    username: process.env.ADMIN_USERNAME,
                    role: 'admin'
                };
                return done(null, admin);
            } else {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
        }

        // Check password for regular users
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }

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
        if (id === 'admin') {
            const admin = {
                id: 'admin',
                username: process.env.ADMIN_USERNAME,
                role: 'admin'
            };
            return done(null, admin);
        }
        
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
