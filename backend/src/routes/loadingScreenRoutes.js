// routes/loadingScreenRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { setLoadingScreenText, getLoadingScreenText } from '../controllers/loadingScreenController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const loadingScreenValidation = [
    body('text').not().isEmpty().withMessage('Text is required')
];

// POST endpoint to set loading screen text
router.post('/set-text', isAuthenticated, isAdmin, loadingScreenValidation, setLoadingScreenText);

// GET endpoint to get loading screen text
router.get('/get-text', getLoadingScreenText);

export default router;
