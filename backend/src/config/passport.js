import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import GameBoard from '../models/gameBoard.js';
import jwt from 'jsonwebtoken';

// Custom strategy for authenticating users based on username and pinCode
passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'pinCode',
    passReqToCallback: true
}, async (req, username, pinCode, done) => {
    try {
        const gameBoard = await GameBoard.findOne({ pinCode }).populate('players');
        if (!gameBoard) {
            return done(null, false, { message: 'Invalid pin code' });
        }

        const user = await User.findOne({ username });
        if (!user || !gameBoard.players.some(player => player.toString() === user._id.toString())) {
            return done(null, false, { message: 'Invalid username or pin code' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Custom strategy for authenticating admin based on username and password
passport.use('admin-local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const admin = {
                id: 'admin',
                username: process.env.ADMIN_USERNAME,
                role: 'admin'
            };
            return done(null, admin);
        } else {
            return done(null, false, { message: 'Incorrect admin credentials' });
        }
    } catch (err) {
        return done(err);
    }
}));

// Serialize user information into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user information from the session
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
