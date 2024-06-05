import { qnA } from '../models/minigames/qnA.js';
import { validationResult } from 'express-validator';

// Controller for adding a question
export const addQuestion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { description, questionText, options, correctOption } = req.body;

    try {
        const newQuestion = {
            questionText,
            options: options.map(option => ({ text: option, votes: 0 })),
            correctOption
        };

        let game = await qnA.findOne({ description });

        if (!game) {
            game = new qnA({ description, questions: [newQuestion] });
        } else {
            game.questions.push(newQuestion);
        }

        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: 'Error adding question', error });
    }
};

// Controller for fetching the current question
export const getCurrentQuestion = async (req, res) => {
    try {
        const game = await qnA.findOne();
        if (!game) {
            return res.status(404).json({ message: 'No game found' });
        }

        const currentQuestion = game.questions[game.currentQuestionIndex];
        res.json(currentQuestion);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching current question', error });
    }
};

// Controller for submitting an answer
export const submitAnswer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, answerIndex } = req.body;
    const { questionId } = req.params;

    try {
        const game = await qnA.findOne({ "questions._id": questionId });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const question = game.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.options[answerIndex].votes += 1;

        await game.save();

        // Calculate and distribute points
        const points = game.calculatePoints();
        // Here you would update the user scores based on the points calculated

        res.json({ message: 'Answer submitted successfully', points });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting answer', error });
    }
};
