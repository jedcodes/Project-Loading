import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        default: 0
    },
    state: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
