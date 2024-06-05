import mongoose from 'mongoose';
import crypto from 'crypto';

// Section: Schema Definition
/**
 * Schema for GameBoard
 */
const gameBoardSchema = new mongoose.Schema({
    // Section: Unique PIN Code
    /**
     * Unique PIN code for the gameboard
     * @type {String}
     * @required
     * @unique
     */
    pinCode: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return crypto.randomBytes(3).toString('hex').toUpperCase();
        }
    },
    // Section: Current Game Index
    /**
     * Index of the current game in the sequence
     * @type {Number}
     * @default 0
     */
    currentGameIndex: {
        type: Number,
        default: 0
    },
    // Section: Game Sequence
    /**
     * Sequence of mini-games
     * @type {Array}
     * @refPath 'sequenceType'
     */
    sequence: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'sequenceType'
    }],
    // Section: Sequence Type
    /**
     * Type of the mini-games in the sequence
     * @type {String}
     * @required
     * @enum ['QnA', 'LoadingScreen'] // Add other mini-games as needed
     */
    sequenceType: {
        type: String,
        required: true,
        enum: ['QnA', 'LoadingScreen'] // Add other mini-games as needed
    },
    // Section: GameBoard Settings
    /**
     * Settings for the gameboard
     */
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
    /**
     * List of players associated with the gameboard
     * @type {Array}
     * @ref 'User'
     */
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Section: Status
    /**
     * Status of the gameboard (active or inactive)
     * @type {Boolean}
     * @default false
     */
    isActive: {
        type: Boolean,
        default: false
    },
    // Section: Timestamps
    /**
     * Timestamp for when the gameboard was created
     * @type {Date}
     * @default Date.now
     */
    createdAt: {
        type: Date,
        default: Date.now
    },
    /**
     * Timestamp for when the gameboard was last updated
     * @type {Date}
     * @default Date.now
     */
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Section: Model Creation
/**
 * Create and export the GameBoard model
 */
const GameBoard = mongoose.model('GameBoard', gameBoardSchema);
export default GameBoard;
