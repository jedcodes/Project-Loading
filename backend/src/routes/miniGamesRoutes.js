import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { qnA, LoadingScreen } from '../models/minigames.js';

const router = express.Router();

// Section: Create Mini-Games
// Route to create qnA mini-game
/**
 * @route POST /minigames/qnA
 * @desc Create qnA mini-game
 * @access Private, Admin
 */
router.post('/minigames/qnA', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const newGame = new qnA(req.body);
        await newGame.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ message: "Error creating mini-game", error });
    }
});

// Route to update qnA mini-game
/**
 * @route PUT /minigames/qnA/:id
 * @desc Update qnA mini-game
 * @access Private, Admin
 */
router.put('/minigames/qnA/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedGame = await qnA.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedGame);
    } catch (error) {
        res.status(400).json({ message: "Error updating mini-game", error });
    }
});

// Route to create loadingScreen mini-game
/**
 * @route POST /minigames/loadingScreen
 * @desc Create loadingScreen mini-game
 * @access Private, Admin
 */
router.post('/minigames/loadingScreen', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const newScreen = new LoadingScreen(req.body);
        await newScreen.save();
        res.status(201).json(newScreen);
    } catch (error) {
        res.status(400).json({ message: "Error creating loading screen", error });
    }
});

// Route to update loadingScreen mini-game
/**
 * @route PUT /minigames/loadingScreen/:id
 * @desc Update loadingScreen mini-game
 * @access Private, Admin
 */
router.put('/minigames/loadingScreen/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedScreen = await LoadingScreen.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedScreen);
    } catch (error) {
        res.status(400).json({ message: "Error updating loading screen", error });
    }
});

export default router;
