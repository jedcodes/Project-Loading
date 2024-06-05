import express from 'express';
import { getUserById, updateUserScore, removeInactiveUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Section: User Routes
// Route to get user data by ID
/**
 * @route GET /:userId
 * @desc Get user data by ID
 * @access Private
 */
router.get('/:userId', isAuthenticated, getUserById);

// Route to update user score
/**
 * @route PUT /:userId/score
 * @desc Update user score
 * @access Private
 */
router.put('/:userId/score', isAuthenticated, updateUserScore);

// Route to remove inactive user
/**
 * @route DELETE /:gameBoardId/user/:userId
 * @desc Remove inactive user
 * @access Private
 */
router.delete('/:gameBoardId/user/:userId', isAuthenticated, removeInactiveUser);

export default router;
