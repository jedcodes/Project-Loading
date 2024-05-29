import express from 'express';
import { body, param } from 'express-validator';
import {
    getGame,
    updateGame,
    startGameSequence,
    endGameSequence,
    getUserStats,
    loadMiniGame // Import the loadMiniGame function
} from '../controllers/gameController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const gameIdValidation = param('gameId').isMongoId().withMessage('Invalid Game ID format');

// Route to get the current game state
router.get('/:gameId', isAuthenticated, gameIdValidation, getGame);

// Route to update game based on user actions
router.post('/:gameId/actions', isAuthenticated, gameIdValidation, body('action').not().isEmpty().withMessage('Action cannot be empty'), updateGame);

// Route to start the game sequence by the admin
router.post('/:gameId/start', isAuthenticated, isAdmin, gameIdValidation, startGameSequence);

// Route to end the game sequence and show stats
router.post('/:gameId/end', isAuthenticated, isAdmin, gameIdValidation, endGameSequence);

// Route to get user stats at the end of the game
router.get('/:gameId/stats', isAuthenticated, gameIdValidation, getUserStats);

// Route to load the current mini-game
router.get('/:gameId/minigame', isAuthenticated, gameIdValidation, loadMiniGame); // New route for loading mini-game

// Error handling for validation results
router.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).send({ message: error.message }); // Bad request error handling
    }
    next();
});

export default router;
