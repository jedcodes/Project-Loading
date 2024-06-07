import express from 'express';
import { body, param } from 'express-validator';
import {
    createGameBoard,
    getGameBoard,
    updateGameBoard,
    startGameSequence,
    endGameSequence,
    getUserStats,
    loadMiniGame,
    getMiniGamesByType,
    submitFeedback
} from '../controllers/gameBoardController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Section: Validation Middleware
/**
 * Validation middleware for gameBoardId
 */
const gameBoardIdValidation = param('gameBoardId').isMongoId().withMessage('Invalid GameBoard ID format');

// Route to create a new game board
/**
 * @route POST /
 * @desc Create a new game board
 * @access Private (Admin only)
 */
router.post('/', isAuthenticated, isAdmin, createGameBoard);

// Section: Routes
// Route to get the current gameBoard state
/**
 * @route GET /:gameBoardId
 * @desc Get the current gameBoard state
 * @access Private
 */
router.get('/:gameBoardId', isAuthenticated, gameBoardIdValidation, getGameBoard);

// Route to update gameBoard based on user actions
/**
 * @route POST /:gameBoardId/actions
 * @desc Update gameBoard based on user actions
 * @access Private
 */
router.post('/:gameBoardId/actions', isAuthenticated, gameBoardIdValidation, body('action').not().isEmpty().withMessage('Action cannot be empty'), updateGameBoard);

// Route to start the game sequence by the admin
/**
 * @route POST /:gameBoardId/start
 * @desc Start the game sequence by the admin
 * @access Private
 */
router.post('/:gameBoardId/start', isAuthenticated, isAdmin, gameBoardIdValidation, startGameSequence);

// Route to end the game sequence and show stats
/**
 * @route POST /:gameBoardId/end
 * @desc End the game sequence and show stats
 * @access Private
 */
router.post('/:gameBoardId/end', isAuthenticated, isAdmin, gameBoardIdValidation, endGameSequence);

// Route to get user stats at the end of the game
/**
 * @route GET /:gameBoardId/stats
 * @desc Get user stats at the end of the game
 * @access Private
 */
router.get('/:gameBoardId/stats', isAuthenticated, gameBoardIdValidation, getUserStats);

// Route to load the current mini-game
/**
 * @route GET /:gameBoardId/minigame
 * @desc Load the current mini-game
 * @access Private
 */
router.get('/:gameBoardId/minigame', isAuthenticated, gameBoardIdValidation, loadMiniGame);

// Route to fetch mini-games by type
/**
 * @route GET /minigames/by-type
 * @desc Fetch mini-games by type
 * @access Private
 */
router.get('/minigames/by-type', isAuthenticated, getMiniGamesByType);

// Route for feedback
/**
 * @route POST /:gameBoardId/feedback
 * @desc Post feedback at the end of the gameboard
 * @access Private
 */
router.post('/:gameBoardId/feedback', isAuthenticated, gameBoardIdValidation, submitFeedback);

// Section: Error Handling Middleware
/**
 * Error handling for validation results
 * @param {Object} error - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).send({ message: error.message }); // Bad request error handling
    }
    next();
});

export default router;
