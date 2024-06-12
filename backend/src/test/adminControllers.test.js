import express from 'express';
import request from 'supertest';
import { io } from '../config/socketConfig.js';
import { sendAdminMessage } from '../controllers/adminControllers.js';

const server = express();
server.use(express.json());
server.post('/send-message', sendAdminMessage);

jest.mock('../config/socketConfig.js', () => ({
	io: {
		to: jest.fn().mockReturnThis(),
		emit: jest.fn(),
	},
}));

describe('sendAdminMessage', () => {
	it('should send a message successfully', async () => {
		const gameBoardId = 'testGameBoardId';
		const message = 'testMessage';

		const res = await request(server)
			.post('/send-message')
			.send({ gameBoardId, message });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: 'Message sent successfully' });
		expect(io.to).toHaveBeenCalledWith(gameBoardId);
		expect(io.emit).toHaveBeenCalledWith('adminMessage', { message });
	});
});
