import cron from 'node-cron';
import GameBoard from '../src/models/gameBoard.js';
import User from '../src/models/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../src/config/config.env' });

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log(`MongoDB Connected for cron jobs: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

connectDB();

// Function to delete inactive users
const deleteInactiveUsers = async () => {
    try {
        const inactiveUsers = await User.find({ updatedAt: { $lt: new Date(Date.now() - 20 * 60 * 1000) } });
        for (const user of inactiveUsers) {
            const gameBoard = await GameBoard.findOne({ players: user._id });
            if (gameBoard) {
                gameBoard.players.pull(user._id);
                await gameBoard.save();
            }
            await User.findByIdAndDelete(user._id);
        }
        console.log('Inactive users deleted successfully');
    } catch (error) {
        console.error('Error deleting inactive users:', error);
    }
};

// Function to delete inactive gameboards
const deleteInactiveGameBoards = async () => {
    try {
        const inactiveGameBoards = await GameBoard.find({ updatedAt: { $lt: new Date(Date.now() - 12 * 60 * 60 * 1000) } });
        for (const gameBoard of inactiveGameBoards) {
            await GameBoard.findByIdAndDelete(gameBoard._id);
        }
        console.log('Inactive gameboards deleted successfully');
    } catch (error) {
        console.error('Error deleting inactive gameboards:', error);
    }
};

// Schedule the deletion tasks
cron.schedule('*/20 * * * *', deleteInactiveUsers); // Run every 20 minutes
cron.schedule('0 */12 * * *', deleteInactiveGameBoards); // Run every 12 hours
