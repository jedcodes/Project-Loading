import request from 'supertest';
import express from 'express';
import { getCurrentQuestion } from '../controllers/qnAController.js';
import QnA from '../models/minigames/qna.js';

jest.mock('../models/minigames/qna.js');
const server = express();
server.use(express.json());
server.get('/question/current', getCurrentQuestion);

describe('getCurrentQuestion', () => {
	it('should return 404 if the game is not found', async () => {
		QnA.findOne.mockResolvedValue(null);

		const res = await request(server).get('/question/current?description=test');

		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual({ message: 'Mini-game not found' });
	});

	it('should return the current question if the game is found', async () => {
		const mockQuestion = { question: 'Test question' };
		QnA.findOne.mockResolvedValue({
			questions: [mockQuestion],
			currentQuestionIndex: 0,
		});

		const res = await request(server).get('/question/current?description=test');

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(mockQuestion);
	});

	it('should return 500 if an error occurs', async () => {
		const mockError = new Error('error');
		QnA.findOne.mockRejectedValue(mockError);

		const res = await request(server).get('/question/current?description=test');
		expect(res.statusCode).toEqual(500);
		expect(res.body.message).toEqual('Error retrieving current question');
	});
});
