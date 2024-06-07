import express from 'express';
import { getAllUsers, getUserById, updateUserScore, removeInactiveUser } from '../controllers/userController.js';
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
 *       500:
 *         description: Error retrieving users
 */
router.get('/', isAuthenticated, getAllUsers);

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
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
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

export default router;
