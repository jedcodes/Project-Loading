import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true  // Ensure usernames are unique
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
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);
export default User;
