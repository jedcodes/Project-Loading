import request from 'supertest';
import express from 'express';
import {
	createGameBoard,
	getAllGameBoards,
} from '../controllers/gameBoardController.js';
import GameBoard from '../models/gameBoard.js';

jest.mock('../models/gameBoard.js');

const app = express();
app.use(express.json());
app.post('/gameboard', createGameBoard);
app.get('/gameboard', getAllGameBoards);

describe('GameBoard Controller', () => {
	it('createGameBoard responds with 201 on success', async () => {
		const gameBoardData = {
			name: 'Test GameBoard',
		};

		GameBoard.mockImplementation(() => {
			return {
				save: () => Promise.resolve(gameBoardData),
			};
		});

		await request(app)
			.post('/gameboard')
			.send(gameBoardData)
			.expect(201)
			.then(response => {
				expect(response.body.gameBoard).toEqual(gameBoardData);
			});
	});

	it('returns 500 when save throws', async () => {
		GameBoard.mockImplementation(() => {
			return {
				save: () => Promise.reject("Couldn't save board"),
			};
		});

		await request(app).post('/gameboard').expect(500);
	});

	it('getAllGameBoards responds with 200 and all gameBoards', async () => {
		const mockGameBoards = [
			{ name: 'Test GameBoard 1' },
			{ name: 'Test GameBoard 2' },
		];

		GameBoard.find.mockImplementation(() => {
			return { populate: () => Promise.resolve(mockGameBoards) };
		});

		await request(app)
			.get('/gameboard')
			.expect(200)
			.then(response => {
				expect(response.body).toEqual(mockGameBoards);
			});
	});
});
