import mongoose from 'mongoose';

const miniGameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    interact: {
        type: String,
        required: true
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const MiniGame = mongoose.model('MiniGame', miniGameSchema);
export default MiniGame;
