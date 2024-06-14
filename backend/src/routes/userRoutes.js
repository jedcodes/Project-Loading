import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserScore,
  removeInactiveUser,
  updateUserVote,
  removeUserFromGameBoard
} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error retrieving users
 */
router.get('/', getAllUsers);

router.post('/remove', removeUserFromGameBoard);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user data by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user data
 */
router.get('/:userId', isAuthenticated, getUserById);

/**
 * @swagger
 * /user/{userId}/score:
 *   put:
 *     summary: Update user score
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 description: The new score of the user
 *     responses:
 *       200:
 *         description: User score updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user score
 */
router.put('/:userId/score', isAuthenticated, updateUserScore);

/**
 * @swagger
 * /user/{gameBoardId}/user/{userId}:
 *   delete:
 *     summary: Remove inactive user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: gameBoardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the game board
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Inactive user removed successfully
 *       404:
 *         description: User or game board not found
 *       500:
 *         description: Error removing inactive user
 */
router.delete('/:gameBoardId/user/:userId', isAuthenticated, removeInactiveUser);



/**
 * @swagger
 * /user/{userId}/vote:
 *   post:
 *     summary: Update user vote
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: number
 *                 description: The new vote count for the user
 *     responses:
 *       200:
 *         description: Vote updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating vote
 */
router.post('/:userId/vote', isAuthenticated, updateUserVote);

export default router;

