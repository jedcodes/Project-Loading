import mongoose from 'mongoose';

// Section: Schema Definition
/**
 * Schema for Blacklist
 * Used to store usernames that are not allowed
 */
const blacklistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
});

// Section: Model Creation
/**
 * Create and export the Blacklist model
 */
const Blacklist = mongoose.model('Blacklist', blacklistSchema);
export default Blacklist;