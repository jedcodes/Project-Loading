import User from '../models/user.js';
import GameBoard from '../models/gameBoard.js';
import { io } from '../config/socketConfig.js';

// Fetch user data by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error });
    }
};

// Update user score
export const updateUserScore = async (req, res) => {
    try {
        const { score } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, { score }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user score', error });
    }
};

// Remove inactive user
export const removeInactiveUser = async (req, res) => {
    try {
        const { userId, gameBoardId } = req.params;
        const gameBoard = await GameBoard.findById(gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const userIndex = gameBoard.players.indexOf(userId);
        if (userIndex !== -1) {
            gameBoard.players.splice(userIndex, 1);
            await gameBoard.save();
            await User.findByIdAndDelete(userId);
            res.json({ message: 'Inactive user removed' });
            io.to(gameBoardId).emit('userRemoved', { userId });
        } else {
            res.status(404).json({ message: 'User not found in GameBoard' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing inactive user', error });
    }
};
