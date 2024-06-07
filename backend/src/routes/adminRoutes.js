import express from 'express';
import { sendAdminMessage } from '../controllers/adminControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /admin/send-message:
 *   post:
 *     summary: Send an admin message
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameBoardId
 *               - message
 *             properties:
 *               gameBoardId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Error sending message
 */
router.post('/send-message', isAuthenticated, isAdmin, (req, res) => {
    sendAdminMessage(req, res);
    res.status(200).json({ message: "Message sent successfully" });
});

export default router;
