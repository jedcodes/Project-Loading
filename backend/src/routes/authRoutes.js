import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import GameBoard from '../models/gameBoard.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Register a new user
 */
router.post('/register', async (req, res) => {
  const { username, pinCode } = req.body;

  if (!username || !pinCode) {
    return res.status(400).json({ message: 'Username and pin code are required' });
  }

  try {
    const gameBoard = await GameBoard.findOne({ pinCode });
    if (!gameBoard) {
      return res.status(400).json({ message: 'Invalid pin code' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({ username });
    await newUser.save();

    gameBoard.players.push(newUser._id);
    await gameBoard.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

/**
 * Login a user
 */
router.post('/login', async (req, res) => {
  const { username, pinCode } = req.body;

  try {
    const gameBoard = await GameBoard.findOne({ pinCode });
    if (!gameBoard) {
      return res.status(400).json({ message: 'Invalid pin code' });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or pin code' });
    }

    if (!gameBoard.players.includes(user._id)) {
      return res.status(400).json({ message: 'User not found in this gameboard' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default router;
