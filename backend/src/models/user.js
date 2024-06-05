import mongoose from 'mongoose';

// Section: Schema Definition
/**
 * Schema for User
 */
const userSchema = new mongoose.Schema({
    // Section: Username
    /**
     * Username of the user, must be unique
     * @type {String}
     * @required
     * @unique
     */
    username: {
        type: String,
        required: true,
        unique: true
    },
    // Section: Score
    /**
     * Score of the user
     * @type {Number}
     * @default 0
     */
    score: {
        type: Number,
        default: 0
    },
    // Section: State
    /**
     * State of the user, can store various types of data
     * @type {Map}
     * @of {mongoose.Schema.Types.Mixed}
     * @default {}
     */
    state: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
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
 * Create and export the User model
 */
const User = mongoose.model('User', userSchema);
export default User;
