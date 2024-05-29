import express from 'express';
import { getUserById, updateUserScore, removeInactiveUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Route to get user data by ID
router.get('/:userId', isAuthenticated, getUserById);

// Route to update user score
router.put('/:userId/score', isAuthenticated, updateUserScore);

// Route to remove inactive user
router.delete('/:gameBoardId/user/:userId', isAuthenticated, removeInactiveUser);

export default router;
