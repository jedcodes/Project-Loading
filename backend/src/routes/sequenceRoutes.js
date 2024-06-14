import express from 'express';
import { createSequence, getSequence, updateSequence } from '../controllers/sequenceController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Define routes for creating, getting, and updating sequences
router.post('/', isAuthenticated, isAdmin, createSequence);
router.get('/:sequenceId', isAuthenticated, getSequence);
router.put('/:sequenceId', isAuthenticated, isAdmin, updateSequence);

export default router;
