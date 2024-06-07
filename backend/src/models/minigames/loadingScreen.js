// models/loadingScreen.js
import mongoose from 'mongoose';

// Schema Definition
const loadingScreenSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model Creation
const LoadingScreen = mongoose.model('LoadingScreen', loadingScreenSchema);
export default LoadingScreen;
