// src/routes/gameBoardRoutes.js
import express from 'express';
import {
    createGameBoard,
    getGameBoard,
    updateGameBoard,
    startGameSequence,
    endGameSequence,
    getUserStats,
    loadMiniGame,
    getMiniGamesByType,
    submitFeedback,
    getAllGameBoards,
    moveToNextMiniGame,
    removeUserFromGameBoard,
    getGameBoardById 
} from '../controllers/gameBoardController.js';
import { isAuthenticated,isAdmin } from '../middleware/auth.js';
import passport from 'passport';

const router = express.Router();

// Routes that require user authentication
router.get('/', getAllGameBoards);
router.post('/remove', removeUserFromGameBoard);
router.get('/:gameBoardId', getGameBoard);
router.get('/:gameBoardId/minigame', loadMiniGame);
router.post('/:gameBoardId/feedback', submitFeedback);


// Routes that require admin authentication
router.post('/', isAuthenticated, createGameBoard);
router.post('/:gameBoardId/actions', isAuthenticated, updateGameBoard);
router.post('/:gameBoardId/start', isAuthenticated, isAdmin, startGameSequence);
router.post('/:gameBoardId/end', isAuthenticated, isAdmin, endGameSequence);
router.post('/:gameBoardId/next', isAuthenticated, moveToNextMiniGame);
router.get('/:gameBoardId/stats', isAuthenticated, getUserStats);
router.get('/minigames/by-type', isAuthenticated, getMiniGamesByType);

router.get('/byId/:id', isAuthenticated, getGameBoardById);

export default router;
