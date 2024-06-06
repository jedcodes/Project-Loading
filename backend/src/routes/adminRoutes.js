import express from 'express';
import { sendAdminMessage } from '../controllers/adminController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-message', isAuthenticated, isAdmin, sendAdminMessage);

export default router;
