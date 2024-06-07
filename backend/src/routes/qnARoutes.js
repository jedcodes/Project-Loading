import express from 'express';
import { body, param } from 'express-validator';
import { addQuestion, getCurrentQuestion, submitAnswer } from '../controllers/qnAController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const questionValidation = [
    body('description').not().isEmpty().withMessage('Description is required'),
    body('questionText').not().isEmpty().withMessage('Question text is required'),
    body('options').isArray({ min: 2 }).withMessage('At least two options are required'),
    body('options.*').not().isEmpty().withMessage('Option text is required')
];

const answerValidation = [
    param('questionId').isMongoId().withMessage('Invalid question ID format'),
    body('answerIndex').isInt({ min: 0 }).withMessage('Answer index is required')
];

// POST endpoint to add a question
/**
 * @route POST /add-question
 * @desc Add a question to QnA mini-game
 * @access Private (Admin only)
 */
router.post('/add-question', isAuthenticated, isAdmin, questionValidation, addQuestion);

// GET endpoint to fetch the current question
/**
 * @route GET /current-question
 * @desc Fetch the current question of the QnA mini-game
 * @access Private
 */
router.get('/current-question', isAuthenticated, getCurrentQuestion);

// POST endpoint for submitting an answer
/**
 * @route POST /submit-answer/:questionId
 * @desc Submit an answer to a QnA question
 * @access Private
 */
router.post('/submit-answer/:questionId', isAuthenticated, answerValidation, submitAnswer);

export default router;
