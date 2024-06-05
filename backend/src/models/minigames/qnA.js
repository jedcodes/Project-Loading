import mongoose from 'mongoose';

// Section: Schema Definition
const qnASchema  = new mongoose.Schema({
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
qnASchema .methods.calculatePoints = function() {
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
const qnA = mongoose.model('qnA', qnASchema);

export { qnA };
