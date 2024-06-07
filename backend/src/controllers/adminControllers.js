import { io } from '../config/socketConfig.js';

export const sendAdminMessage = (req, res) => {
    const { gameBoardId, message } = req.body;

    io.to(gameBoardId).emit('adminMessage', { message });
    res.status(200).json({ message: 'Message sent successfully' });
};
