const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true  // Ensure usernames are unique within a game session
    },
    score: {
        type: Number,
        default: 0  // Default score setup
    },
    state: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,  // Allows storing a flexible object
        default: {}
    },
    recoveryCode: {
        type: String,
        default: () => Math.random().toString(36).substring(2, 15)  // Generate a simple recovery code
    }
}, { _id: false });

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
    players: [playerSchema],
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
module.exports = Game;
