import mongoose from 'mongoose';

// Section: Schema Definition
/**
 * Schema for QnA mini-game
 */
const qnASchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'QnA'
    },
    description: { 
        type: String, 
        required: true 
    },
    questions: [{
        questionText: { 
            type: String, 
            required: true 
        },
        options: [{
            text: { 
                type: String, 
                required: true 
            },
            votes: {
                type: Number,
                default: 0
            },
            branchTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Sequence'  // Branch to next sequence based on answer
            }
        }]
    }],
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Section: Methods
/**
 * Method to calculate points for the current question
 * @returns {Array<Number>} - Points for each option based on votes
 */
qnASchema.methods.calculatePoints = function() {
    const question = this.questions[this.currentQuestionIndex];
    const totalVotes = question.options.reduce((total, option) => total + option.votes, 0);
    const maxVotes = Math.max(...question.options.map(option => option.votes));

    const points = question.options.map(option => {
        if (option.votes === maxVotes) {
            return 10;
        } else if (option.votes >= 0.5 * maxVotes) {
            return 5;
        } else if (option.votes >= 0.2 * maxVotes) {
            return 1;
        } else {
            return 0;
        }
    });

    return points;
};

// Section: Model Creation
/**
 * Create and export the QnA model
 */
const QnA = mongoose.model('QnA', qnASchema);
export default QnA;
