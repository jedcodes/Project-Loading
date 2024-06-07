import express from 'express';
import { sendAdminMessage } from '../controllers/adminControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Route to send an admin message
/**
 * @route POST /send-message
 * @desc Send an admin message
 * @access Private (Admin only)
 */
router.post('/send-message', isAuthenticated, isAdmin, sendAdminMessage);

export default router;
