import mongoose from 'mongoose';

// Section: Schema Definition
/**
 * Schema for Feedback
 * Used to store feedback from users
 */
const feedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    gameBoardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameBoard',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Section: Model Creation
/**
 * Create and export the Feedback model
 */
const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;