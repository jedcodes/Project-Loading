import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Route to submit feedback
/**
 * @route POST /submit
 * @desc Submit feedback
 * @access Private
 */
router.post('/submit', isAuthenticated, submitFeedback);

export default router;
