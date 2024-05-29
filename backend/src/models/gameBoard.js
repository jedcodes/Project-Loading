import mongoose from 'mongoose';

const gameBoardSchema = new mongoose.Schema({
    pinCode: {
        type: String,
        required: true,
        unique: true
    },
    currentGameIndex: {
        type: Number,
        default: 0
    },
    sequence: [{
        type: String,
        ref: 'MiniGame'
    }],
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
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const GameBoard = mongoose.model('GameBoard', gameBoardSchema);
export default GameBoard;
