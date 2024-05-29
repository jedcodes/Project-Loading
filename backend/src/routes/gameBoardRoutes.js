import express from 'express';
import { body, param } from 'express-validator';
import {
    getGameBoard,
    updateGameBoard,
    startGameSequence,
    endGameSequence,
    getUserStats,
    loadMiniGame
} from '../controllers/gameBoardController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const gameBoardIdValidation = param('gameBoardId').isMongoId().withMessage('Invalid GameBoard ID format');

// Route to get the current gameBoard state
router.get('/:gameBoardId', isAuthenticated, gameBoardIdValidation, getGameBoard);

// Route to update gameBoard based on user actions
router.post('/:gameBoardId/actions', isAuthenticated, gameBoardIdValidation, body('action').not().isEmpty().withMessage('Action cannot be empty'), updateGameBoard);

// Route to start the game sequence by the admin
router.post('/:gameBoardId/start', isAuthenticated, isAdmin, gameBoardIdValidation, startGameSequence);

// Route to end the game sequence and show stats
router.post('/:gameBoardId/end', isAuthenticated, isAdmin, gameBoardIdValidation, endGameSequence);

// Route to get user stats at the end of the game
router.get('/:gameBoardId/stats', isAuthenticated, gameBoardIdValidation, getUserStats);

// Route to load the current mini-game
router.get('/:gameBoardId/minigame', isAuthenticated, gameBoardIdValidation, loadMiniGame); 

// Error handling for validation results
router.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).send({ message: error.message }); // Bad request error handling
    }
    next();
});

export default router;
