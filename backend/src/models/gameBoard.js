import mongoose from 'mongoose';
import crypto from 'crypto';

// Section: Schema Definition
/**
 * Schema for GameBoard
 */
const gameBoardSchema = new mongoose.Schema({
    // Section: Unique PIN Code
    pinCode: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return crypto.randomBytes(3).toString('hex').toUpperCase();
        }
    },
    // Section: Current Game Index
    currentGameIndex: {
        type: Number,
        default: 0
    },
    // Section: Game Sequence
    sequence: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sequence'
    }],
    // Section: GameBoard Settings
    settings: {
        background: {
            type: String,
            default: 'default.jpg'
        },
        theme: {
            type: String,
            default: 'standard'
        }
    },
    // Section: Players
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Section: Status
    isActive: {
        type: Boolean,
        default: false
    },
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

// Section: Branching Schema Definition
/**
 * Schema for Game Branching
 */
const gameBranchSchema = new mongoose.Schema({
    currentGameId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sequence'
    },
    nextGameIds: [{
        answer: { type: Number, required: true },
        gameId: { type: mongoose.Schema.Types.ObjectId, refPath: 'sequence' }
    }]
});

// Add branching schema to the game board schema
gameBoardSchema.add({
    branches: [gameBranchSchema]
});

// Section: Model Creation
/**
 * Create and export the GameBoard model
 */
const GameBoard = mongoose.model('GameBoard', gameBoardSchema);
export default GameBoard;