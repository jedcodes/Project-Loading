import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MiniGame from '../models/miniGame.js';
import { trykkeReaksjoner, svarPåSpørsmål, musikkquiz } from '../miniGames/gameIndex.js';

dotenv.config({ path: './src/config/config.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,y6t 
            useFindAndModify: false
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        await MiniGame.deleteMany();

        const miniGames = [musikkquiz, svarPåSpørsmål, trykkeReaksjoner].map(game => ({
            name: game.name,
            description: game.description,
            interact: game.interact.toString()
        }));

        await MiniGame.insertMany(miniGames);

        console.log('MiniGames imported successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing mini-games:', error);
        process.exit(1);
    }
};

importData();
