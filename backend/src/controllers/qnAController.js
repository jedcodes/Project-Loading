import QnA from '../models/minigames/qna.js';

// Add Question to QnA Mini-Game
export const addQuestion = async (req, res) => {
    const { description, questionText, options } = req.body;

    try {
        const newQuestion = {
            questionText,
            options: options.map(text => ({ text, votes: 0 }))
        };

        let qnaGame = await QnA.findOne({ description });
        if (!qnaGame) {
            qnaGame = new QnA({ description, questions: [newQuestion] });
        } else {
            qnaGame.questions.push(newQuestion);
        }

        await qnaGame.save();
        res.status(201).json(qnaGame);
    } catch (error) {
        res.status(400).json({ message: "Error creating mini-game", error });
    }
};

// Get Current Question
export const getCurrentQuestion = async (req, res) => {
    const { description } = req.query;

    try {
        const qnaGame = await QnA.findOne({ description });
        if (!qnaGame) {
            return res.status(404).json({ message: 'Mini-game not found' });
        }

        const currentQuestion = qnaGame.questions[qnaGame.currentQuestionIndex];
        res.json(currentQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving current question', error });
    }
};

// Submit Answer
export const submitAnswer = async (req, res) => {
    const { questionId } = req.params;
    const { answerIndex } = req.body;

    try {
        const qnaGame = await QnA.findOne({ "questions._id": questionId });
        const question = qnaGame.questions.id(questionId);

        if (question) {
            question.options[answerIndex].votes += 1;
            await qnaGame.save();

            res.send({ message: 'Answer submitted successfully' });
        } else {
            res.status(404).send({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error submitting answer', error });
    }
};