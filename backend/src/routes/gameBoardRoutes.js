import express from 'express';
import {
    createGameBoard,
    getGameBoard,
    updateGameBoard,
    startGameSequence,
    endGameSequence,
    getUserStats,
    loadMiniGame,
    getMiniGamesByType,
    submitFeedback,
    getAllGameBoards // Import the new function
} from '../controllers/gameBoardController.js';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: GameBoard
 *   description: GameBoard management
 */

/**
 * @swagger
 * /gameboard:
 *   post:
 *     summary: Create a new game board
 *     tags: [GameBoard]
 *     responses:
 *       201:
 *         description: Game board created successfully
 *       500:
 *         description: Error creating game board
 */
router.post('/', isAuthenticated, isAdmin, createGameBoard);

/**
 * @swagger
 * /gameboard:
 *   get:
 *     summary: Get all game boards
 *     tags: [GameBoard]
 *     responses:
 *       200:
 *         description: A list of all game boards
 *       500:
 *         description: Error retrieving game boards
 */
router.get('/', getAllGameBoards); // Add this line

/**
 * @swagger
 * /gameboard/{gameBoardId}:
 *   get:
 *     summary: Get the current gameBoard state
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       200:
 *         description: Game board state
 *       404:
 *         description: Game board not found
 *       500:
 *         description: Error retrieving game board data
 */
router.get('/:gameBoardId', getGameBoard);

/**
 * @swagger
 * /gameboard/{gameBoardId}/actions:
 *   post:
 *     summary: Update game board based on user actions
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       200:
 *         description: Game board updated successfully
 *       404:
 *         description: Game board not found
 *       500:
 *         description: Error updating game board
 */
router.post('/:gameBoardId/actions', isAuthenticated, updateGameBoard);

/**
 * @swagger
 * /gameboard/{gameBoardId}/start:
 *   post:
 *     summary: Start the game sequence by the admin
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       200:
 *         description: Game sequence started successfully
 *       404:
 *         description: Game board not found
 *       500:
 *         description: Error starting game sequence
 */
router.post('/:gameBoardId/start', isAuthenticated, isAdmin, startGameSequence);

/**
 * @swagger
 * /gameboard/{gameBoardId}/end:
 *   post:
 *     summary: End the game sequence and show stats
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       200:
 *         description: Game sequence ended successfully
 *       404:
 *         description: Game board not found
 *       500:
 *         description: Error ending game sequence
 */
router.post('/:gameBoardId/end', isAuthenticated, isAdmin, endGameSequence);

/**
 * @swagger
 * /gameboard/{gameBoardId}/stats:
 *   get:
 *     summary: Get user stats at the end of the game
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       200:
 *         description: User stats
 *       404:
 *         description: Game board not found
 *       500:
 *         description: Error retrieving user stats
 */
router.get('/:gameBoardId/stats', isAuthenticated, getUserStats);

/**
 * @swagger
 * /gameboard/{gameBoardId}/minigame:
 *   get:
 *     summary: Load the current mini-game
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       200:
 *         description: Mini-game data
 *       404:
 *         description: Mini-game not found
 *       500:
 *         description: Error loading mini-game
 */
router.get('/:gameBoardId/minigame', isAuthenticated, loadMiniGame);

/**
 * @swagger
 * /gameboard/minigames/by-type:
 *   get:
 *     summary: Fetch mini-games by type
 *     tags: [GameBoard]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The type of mini-game
 *     responses:
 *       200:
 *         description: Mini-games data
 *       400:
 *         description: Invalid mini-game type
 *       500:
 *         description: Error retrieving mini-games
 */
router.get('/minigames/by-type', isAuthenticated, getMiniGamesByType);

/**
 * @swagger
 * /gameboard/{gameBoardId}/feedback:
 *   post:
 *     summary: Submit feedback
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       404:
 *         description: Game board not found
 *       500:
 *         description: Error submitting feedback
 */
router.post('/:gameBoardId/feedback', isAuthenticated, submitFeedback);

// Dummy route for testing
router.get('/dummy', (req, res) => {
    res.status(200).json({ message: "Dummy route works!" });
});

export default router;
