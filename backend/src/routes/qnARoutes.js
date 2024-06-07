import express from 'express';
import { body, param } from 'express-validator';
import { addQuestion, getCurrentQuestion, submitAnswer, getAllQuestions } from '../controllers/qnAController.js';
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

/**
 * @swagger
 * tags:
 *   name: QnA
 *   description: QnA mini-game management
 */

/**
 * @swagger
 * /qna/add-question:
 *   post:
 *     summary: Add a question to QnA mini-game
 *     tags: [QnA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - questionText
 *               - options
 *             properties:
 *               description:
 *                 type: string
 *               questionText:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Question added successfully
 *       400:
 *         description: Error adding question
 */
router.post('/add-question', isAuthenticated, isAdmin, questionValidation, addQuestion);

/**
 * @swagger
 * /qna/current-question:
 *   get:
 *     summary: Fetch the current question of the QnA mini-game
 *     tags: [QnA]
 *     parameters:
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         required: true
 *         description: Description of the QnA mini-game
 *     responses:
 *       200:
 *         description: Current question
 *       404:
 *         description: Mini-game not found
 *       500:
 *         description: Error retrieving current question
 */
router.get('/current-question', isAuthenticated, getCurrentQuestion);

/**
 * @swagger
 * /qna/submit-answer/{questionId}:
 *   post:
 *     summary: Submit an answer to a QnA question
 *     tags: [QnA]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answerIndex
 *             properties:
 *               answerIndex:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Error submitting answer
 */
router.post('/submit-answer/:questionId', isAuthenticated, answerValidation, submitAnswer);

/**
 * @swagger
 * /qna/all-questions:
 *   get:
 *     summary: Get all QnA questions
 *     tags: [QnA]
 *     responses:
 *       200:
 *         description: All questions retrieved successfully
 *       500:
 *         description: Error retrieving questions
 */
router.get('/all-questions', isAuthenticated, getAllQuestions);

export default router;
