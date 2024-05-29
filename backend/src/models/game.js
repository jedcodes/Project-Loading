import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    currentGameIndex: {
        type: Number,
        default: 0
    },
    sequence: [{ 
        type: String,
        ref: 'MiniGame'  // Assuming you might have a MiniGame model that details each game
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

// Middleware to handle updating the "updatedAt" field on save
gameSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Game = mongoose.model('Game', gameSchema);
export default Game;
