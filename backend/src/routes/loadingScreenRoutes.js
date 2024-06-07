import express from 'express';
import { body } from 'express-validator';
import { setLoadingScreenText, getLoadingScreenText, getAllLoadingScreens } from '../controllers/loadingScreenController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const loadingScreenValidation = [
    body('text').not().isEmpty().withMessage('Text is required')
];

/**
 * @swagger
 * tags:
 *   name: LoadingScreen
 *   description: Loading screen management
 */

/**
 * @swagger
 * /loadingScreen/set-text:
 *   post:
 *     summary: Set loading screen text
 *     tags: [LoadingScreen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to display on the loading screen
 *                 example: "Loading, please wait..."
 *     responses:
 *       200:
 *         description: Loading screen text set successfully
 *       400:
 *         description: Invalid input, object invalid
 *       500:
 *         description: Error setting loading screen text
 */
router.post('/set-text', isAuthenticated, isAdmin, loadingScreenValidation, setLoadingScreenText);

/**
 * @swagger
 * /loadingScreen/get-text:
 *   get:
 *     summary: Get loading screen text
 *     tags: [LoadingScreen]
 *     responses:
 *       200:
 *         description: Loading screen text retrieved successfully
 *       404:
 *         description: Loading screen text not found
 *       500:
 *         description: Error retrieving loading screen text
 */
router.get('/get-text', getLoadingScreenText);

/**
 * @swagger
 * /loadingScreen/all:
 *   get:
 *     summary: Get all loading screens
 *     tags: [LoadingScreen]
 *     responses:
 *       200:
 *         description: All loading screens retrieved successfully
 *       500:
 *         description: Error retrieving loading screens
 */
router.get('/all', getAllLoadingScreens);

export default router;
