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
    body('options.*').not().isEmpty().withMessage('Option text is required'),
    body('correctOption').isInt({ min: 0 }).withMessage('Correct option index is required')
];

const answerValidation = [
    param('questionId').isMongoId().withMessage('Invalid question ID format'),
    body('answerIndex').isInt({ min: 0 }).withMessage('Answer index is required')
];

// POST endpoint to add a question
router.post('/add-question', isAuthenticated, isAdmin, questionValidation, addQuestion);

// GET endpoint to fetch the current question
router.get('/current-question', isAuthenticated, getCurrentQuestion);

// POST endpoint for submitting an answer
router.post('/submit-answer/:questionId', isAuthenticated, answerValidation, submitAnswer);

export default router;
