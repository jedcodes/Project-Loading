import Feedback from '../models/feedback.js';

export const submitFeedback = async (req, res) => {
    const { username, gameBoardId, feedback, stars } = req.body;

    try {
        const newFeedback = new Feedback({ username, gameBoardId, feedback, stars });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};
