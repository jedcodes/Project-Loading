import GameBoard from '../models/gameBoard.js';
import User from '../models/user.js';
import MiniGame from '../models/miniGame.js';
import { io } from '../config/socketConfig.js';

// Fetch current gameBoard state
export const getGameBoard = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findById(req.params.gameBoardId).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: "GameBoard not found" });
        }
        res.json(gameBoard);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving gameBoard data", error });
    }
};

// Load mini-game
export const loadMiniGame = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findById(req.params.gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const currentMiniGameName = gameBoard.sequence[gameBoard.currentGameIndex];
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
        io.emit('miniGameLoaded', { gameBoardId: req.params.gameBoardId, miniGame: currentMiniGame });
    } catch (error) {
        res.status(500).json({ message: 'Error loading mini-game', error });
    }
};

// Update gameBoard based on user actions
export const updateGameBoard = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findByIdAndUpdate(req.params.gameBoardId, { $set: req.body }, { new: true }).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: "GameBoard not found" });
        }
        res.json(gameBoard);
        // Emit updated gameBoard state to all clients
        io.emit('gameBoardUpdated', { gameBoardId: req.params.gameBoardId, gameBoard });
    } catch (error) {
        res.status(500).json({ message: "Error updating gameBoard", error });
    }
};

// Start game sequence controlled by admin
export const startGameSequence = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findById(req.params.gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }
        gameBoard.isActive = true;
        gameBoard.currentGameIndex = 0;  // Reset or set to initial state
        await gameBoard.save();
        res.json({ message: 'Game sequence started', gameBoard });
        // Notify all clients that the game sequence has started
        io.emit('gameSequenceStarted', { gameBoardId: req.params.gameBoardId });
    } catch (error) {
        res.status(500).json({ message: 'Error starting game sequence', error });
    }
};

// End game sequence and show stats
export const endGameSequence = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findById(req.params.gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }
        gameBoard.isActive = false;
        await gameBoard.save();
        res.json({ message: 'Game sequence ended', gameBoard });
        // Emit event to notify clients the game sequence has ended
        io.emit('gameSequenceEnded', { gameBoardId: req.params.gameBoardId });
    } catch (error) {
        res.status(500).json({ message: 'Error ending game sequence', error });
    }
};

// Get user stats
export const getUserStats = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findById(req.params.gameBoardId).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }
        const stats = gameBoard.players.map(player => ({
            username: player.username,
            score: player.score
        }));
        res.json({ stats });
        // Emit user stats to all clients
        io.emit('userStatsUpdated', { gameBoardId: req.params.gameBoardId, stats });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user stats', error });
    }
};
