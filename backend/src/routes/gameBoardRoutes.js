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
    submitFeedback
} from '../controllers/gameBoardController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: GameBoard
 *   description: GameBoard management and operations
 */

/**
 * @swagger
 * /gameboard:
 *   post:
 *     summary: Create a new game board
 *     tags: [GameBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: GameBoard created successfully
 *       500:
 *         description: Error creating game board
 */
router.post('/', isAuthenticated, isAdmin, createGameBoard);

/**
 * @swagger
 * /gameboard/{gameBoardId}:
 *   get:
 *     summary: Get the current gameBoard state
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GameBoard state retrieved successfully
 *       404:
 *         description: GameBoard not found
 *       500:
 *         description: Error retrieving gameBoard data
 */
router.get('/:gameBoardId', isAuthenticated, getGameBoard);

/**
 * @swagger
 * /gameboard/{gameBoardId}/actions:
 *   post:
 *     summary: Update gameBoard based on user actions
 *     tags: [GameBoard]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *     responses:
 *       200:
 *         description: GameBoard updated successfully
 *       404:
 *         description: GameBoard not found
 *       500:
 *         description: Error updating gameBoard
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
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game sequence started successfully
 *       404:
 *         description: GameBoard not found
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
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game sequence ended successfully
 *       404:
 *         description: GameBoard not found
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
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *       404:
 *         description: GameBoard not found
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
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mini-game loaded successfully
 *       404:
 *         description: GameBoard not found
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of mini-games to fetch
 *     responses:
 *       200:
 *         description: Mini-games retrieved successfully
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
 *         required: true
 *         schema:
 *           type: string
 *         description: The gameBoard ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       404:
 *         description: GameBoard not found
 *       500:
 *         description: Error submitting feedback
 */
router.post('/:gameBoardId/feedback', isAuthenticated, submitFeedback);

/**
 * @swagger
 * /gameboard/dummy:
 *   get:
 *     summary: Dummy route for testing
 *     tags: [GameBoard]
 *     responses:
 *       200:
 *         description: Dummy route works!
 */
router.get('/dummy', (req, res) => {
    res.status(200).json({ message: "Dummy route works!" });
});

export default router;
