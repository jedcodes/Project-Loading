import mongoose from 'mongoose';

// Section: Schema Definition
const sequenceSchema = new mongoose.Schema({
    miniGames: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'miniGameType'
    }],
    miniGameType: {
        type: String,
        required: true,
        enum: ['QnA', 'LoadingScreen'] // Add other mini-games as needed
    },
    branches: [{
        answer: { type: Number, required: true },
        nextSequence: { type: mongoose.Schema.Types.ObjectId, ref: 'Sequence' }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Sequence = mongoose.model('Sequence', sequenceSchema);
export default Sequence;
