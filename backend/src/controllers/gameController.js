import Game from '../models/game.js';
import User from '../models/user.js';
import MiniGame from '../models/miniGame.js';
import { io } from '../config/socketConfig.js';

// Fetch current game state
export const getGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players');
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving game data", error });
    }
};

// Load mini-game
export const loadMiniGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const currentMiniGameName = game.sequence[game.currentGameIndex];
        const currentMiniGame = await MiniGame.findOne({ name: currentMiniGameName });
        if (!currentMiniGame) {
            return res.status(404).json({ message: 'Mini-game not found' });
        }

        res.json({
            gameData: {
                name: currentMiniGame.name,
                description: currentMiniGame.description
            }
        });
        // Emit event to update clients about the new mini-game loaded
        io.emit('miniGameLoaded', { gameId: req.params.gameId, miniGame: currentMiniGame });
    } catch (error) {
        res.status(500).json({ message: 'Error loading mini-game', error });
    }
};

// Other controller functions remain unchanged

// Update game based on user actions
export const updateGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, { $set: req.body }, { new: true }).populate('players');
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json(game);
        // Emit updated game state to all clients
        io.emit('gameUpdated', { gameId: req.params.gameId, game });
    } catch (error) {
        res.status(500).json({ message: "Error updating game", error });
    }
};

// Start game sequence controlled by admin
export const startGameSequence = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        game.isActive = true;
        game.currentGameIndex = 0;  // Reset or set to initial state
        await game.save();
        res.json({ message: 'Game sequence started', game });
        // Notify all clients that the game sequence has started
        io.emit('gameSequenceStarted', { gameId: req.params.gameId });
    } catch (error) {
        res.status(500).json({ message: 'Error starting game sequence', error });
    }
};

// End game sequence and show stats
export const endGameSequence = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        game.isActive = false;
        await game.save();
        res.json({ message: 'Game sequence ended', game });
        // Emit event to notify clients the game sequence has ended
        io.emit('gameSequenceEnded', { gameId: req.params.gameId });
    } catch (error) {
        res.status(500).json({ message: 'Error ending game sequence', error });
    }
};

// Get user stats
export const getUserStats = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players');
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        const stats = game.players.map(player => ({
            username: player.username,
            score: player.score
        }));
        res.json({ stats });
        // Emit user stats to all clients
        io.emit('userStatsUpdated', { gameId: req.params.gameId, stats });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user stats', error });
    }
};
