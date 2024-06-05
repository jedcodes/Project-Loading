import mongoose from 'mongoose';

// Section: Schema Definition
/**
 * Schema for MiniGame
 */
const miniGameSchema = new mongoose.Schema({
    // Section: Mini-Game Name
    /**
     * Name of the mini-game
     * @type {String}
     * @required
     */
    name: {
        type: String,
        required: true
    },
    // Section: Mini-Game Description
    /**
     * Description of the mini-game
     * @type {String}
     * @required
     */
    description: {
        type: String,
        required: true
    },
    // Section: Interaction Type
    /**
     * Interaction type or method for the mini-game
     * @type {String}
     * @required
     */
    interact: {
        type: String,
        required: true
    }
}, {
    // Section: Timestamps
    /**
     * Automatically add createdAt and updatedAt fields
     */
    timestamps: true
});

// Section: Model Creation
/**
 * Create and export the MiniGame model
 */
const MiniGame = mongoose.model('MiniGame', miniGameSchema);
export default MiniGame;
