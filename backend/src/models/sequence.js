import mongoose from 'mongoose';

// Section: Schema Definition
/**
 * Schema for Sequence
 */
const sequenceSchema = new mongoose.Schema({
    // Section: Mini-Games
    miniGames: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'miniGameType'
    }],
    // Section: Mini-Game Type
    miniGameType: {
        type: String,
        required: true,
        enum: ['QnA', 'LoadingScreen'] // Add other mini-games as needed
    },
    // Section: Branches
    branches: [{
        answer: { type: Number, required: true },
        nextSequence: { type: mongoose.Schema.Types.ObjectId, ref: 'Sequence' }
    }],
    // Section: Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Section: Model Creation
/**
 * Create and export the Sequence model
 */
const Sequence = mongoose.model('Sequence', sequenceSchema);
export default Sequence;