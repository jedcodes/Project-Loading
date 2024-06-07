import dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

import mongoose from 'mongoose';
import GameBoard from '../src/models/gameBoard.js';
import Sequence from '../src/models/sequence.js';
import QnA from '../src/models/minigames/qna.js';
import LoadingScreen from '../src/models/minigames/loadingScreen.js';


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const createDummyData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await GameBoard.deleteMany({});
        await Sequence.deleteMany({});
        await QnA.deleteMany({});
        await LoadingScreen.deleteMany({});

        // Create QnA mini-game
        const secondQnA = new QnA({
            description: 'Second QnA Game',
            questions: [{
                questionText: 'What is your favorite color?',
                options: [
                    { text: 'Red' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    { text: 'Yellow' }
                ]
            }]
        });
        await secondQnA.save();

        const loadingScreen = new LoadingScreen({
            text: 'Loading... Please wait.' // Ensure the required text field is included
        });
        await loadingScreen.save();

        const initialQnA = new QnA({
            description: 'Initial QnA Game',
            questions: [{
                questionText: 'What is 2 + 2?',
                options: [
                    { text: '4', branchTo: loadingScreen._id },
                    { text: '5', branchTo: secondQnA._id }
                ]
            }]
        });
        await initialQnA.save();

        // Create sequences
        const firstSequence = new Sequence({
            miniGames: [initialQnA._id],
            miniGameType: 'QnA',
            branches: [
                { answer: 0, nextSequence: loadingScreen._id },
                { answer: 1, nextSequence: secondQnA._id }
            ]
        });
        await firstSequence.save();

        const secondSequence = new Sequence({
            miniGames: [loadingScreen._id],
            miniGameType: 'LoadingScreen'
        });
        await secondSequence.save();

        const thirdSequence = new Sequence({
            miniGames: [secondQnA._id],
            miniGameType: 'QnA'
        });
        await thirdSequence.save();

        // Create game board
        const gameBoard = new GameBoard({
            pinCode: '123456',
            currentGameIndex: 0,
            sequence: [firstSequence._id, secondSequence._id, thirdSequence._id],
            settings: {
                background: 'default.jpg',
                theme: 'standard'
            },
            players: [],
            isActive: true
        });
        await gameBoard.save();

        console.log('Dummy data created successfully');
        process.exit();
    } catch (error) {
        console.error('Error creating dummy data:', error);
        process.exit(1);
    }
};

createDummyData();
