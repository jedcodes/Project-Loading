import { io } from '../config/socketConfig.js';

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
