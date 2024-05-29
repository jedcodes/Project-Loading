import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import GameBoard from '../models/gameBoard.js';

const router = express.Router();

// Admin credentials from environment variables
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';

// Register User
router.post('/register', async (req, res) => {
    const { username, pinCode } = req.body;
    
    try {
        const gameBoard = await GameBoard.findOne({ pinCode });
        if (!gameBoard) {
            return res.status(400).json({ message: 'Invalid pin code' });
        }

        // Check if username is unique within the gameBoard
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const newUser = new User({
            username
        });

        // Save new user
        await newUser.save();

        // Add user to gameBoard
        gameBoard.players.push(newUser._id);
        await gameBoard.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { username, pinCode } = req.body;
    
    try {
        const gameBoard = await GameBoard.findOne({ pinCode });
        if (!gameBoard) {
            return res.status(400).json({ message: 'Invalid pin code' });
        }

        let user = await User.findOne({ username });
        if (!user) {
            // Create a new user if not exists
            user = new User({ username });
            await user.save();
            gameBoard.players.push(user._id);
            await gameBoard.save();
        }

        // Ensure the user is part of the gameBoard
        if (!gameBoard.players.includes(user._id)) {
            gameBoard.players.push(user._id);
            await gameBoard.save();
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', err });
            }
            res.status(200).json({ message: 'Login successful', user });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === adminUsername) {
        const isMatch = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10));
        if (isMatch) {
            req.logIn({ username: adminUsername, role: 'admin' }, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Server error', err });
                }
                res.status(200).json({ message: 'Admin login successful' });
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
});

// Logout User or Admin
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', err });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

export default router;
