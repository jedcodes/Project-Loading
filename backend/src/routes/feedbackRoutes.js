import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', isAuthenticated, submitFeedback);

export default router;
