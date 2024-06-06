import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
export default Blacklist;
