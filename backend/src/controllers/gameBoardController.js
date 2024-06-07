import GameBoard from '../models/gameBoard.js';
import User from '../models/user.js';
import QnA from '../models/minigames/qna.js';
//import LoadingScreen from '../models/minigames/loadingScreen.js';  // Ensure this is imported
import Feedback from '../models/feedback.js';  // Ensure this is imported
import { io } from '../config/socketConfig.js';

// Section: Create a New GameBoard
/**
 * Create a new GameBoard
 * @route POST /gameboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createGameBoard = async (req, res) => {
    try {
        const newGameBoard = new GameBoard(req.body);
        await newGameBoard.save();
        res.status(201).json({ gameBoard: newGameBoard, pinCode: newGameBoard.pinCode });
    } catch (error) {
        res.status(500).json({ message: 'Error creating game board', error });
    }
};

// Section: Fetch Current GameBoard State
/**
 * Fetch the current state of a gameBoard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

// Section: Load Mini-Game
/**
 * Load a mini-game for the current gameBoard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const loadMiniGame = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findById(req.params.gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const currentMiniGameId = gameBoard.sequence[gameBoard.currentGameIndex];
        let currentMiniGame;

        switch (gameBoard.sequenceType) {
            case 'QnA':
                currentMiniGame = await QnA.findById(currentMiniGameId);
                break;
            case 'LoadingScreen':
                currentMiniGame = await LoadingScreen.findById(currentMiniGameId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid mini-game type' });
        }

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

// Section: Update GameBoard
/**
 * Update the state of the gameBoard based on user actions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

// Section: Start Game Sequence
/**
 * Start the game sequence controlled by the admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

// Section: End Game Sequence
/**
 * End the current game sequence and show stats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

// Section: Get User Stats
/**
 * Retrieve the stats for all users in the gameBoard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

// Section: Get Mini-Games by Type
/**
 * Get mini-games by type
 * @route GET /gameboard/minigames/by-type
 */
export const getMiniGamesByType = async (req, res) => {
    const { type } = req.query;

    try {
        let miniGames;
        switch (type) {
            case 'QnA':
                miniGames = await QnA.find();
                break;
            case 'LoadingScreen':
                miniGames = await LoadingScreen.find();
                break;
            default:
                return res.status(400).json({ message: 'Invalid mini-game type' });
        }

        res.json(miniGames);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving mini-games', error });
    }
};

// Section: Submit Feedback
/**
 * Submit feedback
 * @route POST /gameboard/feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const submitFeedback = async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const gameBoard = await GameBoard.findById(req.params.gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const feedback = new Feedback({ user: userId, rating, comment });
        await feedback.save();

        gameBoard.feedback.push(feedback._id);
        await gameBoard.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};
