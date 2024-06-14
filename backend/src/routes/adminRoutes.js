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
    getAllGameBoards
} from '../controllers/gameBoardController.js';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', isAuthenticated, isAdmin, createGameBoard);
router.get('/', getAllGameBoards);
router.get('/:gameBoardId', getGameBoard);
router.post('/:gameBoardId/actions', isAuthenticated, updateGameBoard);
router.post('/:gameBoardId/start', isAuthenticated, isAdmin, startGameSequence);
router.post('/:gameBoardId/end', isAuthenticated, isAdmin, endGameSequence);
router.get('/:gameBoardId/stats', isAuthenticated, getUserStats);
router.get('/:gameBoardId/minigame', isAuthenticated, loadMiniGame);
router.get('/minigames/by-type', isAuthenticated, getMiniGamesByType);
router.post('/:gameBoardId/feedback', isAuthenticated, submitFeedback);

export default router;
