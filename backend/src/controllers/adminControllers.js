import { io } from '../config/socketConfig.js';
import GameBoard from '../models/GameBoard.js';

/**
 * Controller to send an admin message to a specific game board
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendAdminMessage = (req, res) => {
    const { gameBoardId, message } = req.body;

    io.to(gameBoardId).emit('adminMessage', { message });
    res.status(200).json({ message: 'Message sent successfully' });
};

/**
 * Controller to start a game board
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const startGameBoard = async (req, res) => {
    try {
        const { gameBoardId } = req.body;
        const gameBoard = await GameBoard.findById(gameBoardId);

        if (!gameBoard) {
            return res.status(404).json({ error: 'Game board not found' });
        }

        gameBoard.isActive = true;
        await gameBoard.save();

        io.to(gameBoardId).emit('gameStarted', { message: 'Game has started' });
        res.status(200).json({ message: 'Game board started successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error starting game board' });
    }
};

/**
 * Controller to play the next mini-game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const playNextMiniGame = async (req, res) => {
    try {
        const { gameBoardId } = req.body;
        const gameBoard = await GameBoard.findById(gameBoardId);

        if (!gameBoard) {
            return res.status(404).json({ error: 'Game board not found' });
        }

        gameBoard.currentGameIndex += 1;
        await gameBoard.save();

        io.to(gameBoardId).emit('nextMiniGame', { message: 'Next mini-game started' });
        res.status(200).json({ message: 'Next mini-game started successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error starting next mini-game' });
    }
};

/**
 * Controller to end a mini-game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const endMiniGame = async (req, res) => {
    try {
        const { gameBoardId } = req.body;
        const gameBoard = await GameBoard.findById(gameBoardId);

        if (!gameBoard) {
            return res.status(404).json({ error: 'Game board not found' });
        }

        gameBoard.isActive = false;
        await gameBoard.save();

        io.to(gameBoardId).emit('miniGameEnded', { message: 'Mini-game ended' });
        res.status(200).json({ message: 'Mini-game ended successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error ending mini-game' });
    }
};
