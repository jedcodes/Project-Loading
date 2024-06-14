import express from 'express';
import { body } from 'express-validator';
import { setLoadingScreenText, getLoadingScreenText, getAllLoadingScreens } from '../controllers/loadingScreenController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const loadingScreenValidation = [
    body('text').not().isEmpty().withMessage('Text is required')
];

router.post('/set-text', isAuthenticated, isAdmin, loadingScreenValidation, setLoadingScreenText);

router.get('/get-text', getLoadingScreenText);

router.get('/all', getAllLoadingScreens);

export default router;
