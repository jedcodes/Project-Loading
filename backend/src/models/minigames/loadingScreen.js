import mongoose from 'mongoose';

const loadingScreenSchema = new mongoose.Schema({
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const LoadingScreen = mongoose.model('LoadingScreen', loadingScreenSchema);
export { LoadingScreen };
