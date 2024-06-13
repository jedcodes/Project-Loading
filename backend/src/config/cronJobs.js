// src/config/cronJobs.js
import cron from 'node-cron';
import GameBoard from '../models/gameBoard.js';
import User from '../models/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../config/config.env' });

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

// Schedule the deletion tasks(actived when needed)
const scheduleCronJobs = () => {
    //cron.schedule('*/1 * * * *', deleteInactiveUsers); // Run every 20 minutes
    //cron.schedule('0 */12 * * *', deleteInactiveGameBoards); // Run every 12 hours
};

export default scheduleCronJobs;
