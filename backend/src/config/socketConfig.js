import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import GameBoard from '../models/gameBoard.js';
import User from '../models/user.js';

let io;

function setupSocket(server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGameBoard', async ({ pinCode, username }) => {
      try {
        const gameBoard = await GameBoard.findOne({ pinCode }).populate('players');
        if (!gameBoard) {
          socket.emit('error', { message: 'Invalid pin code' });
          return;
        }

        const existingUser = gameBoard.players.find(player => player.username === username);
        if (existingUser) {
          socket.emit('error', { message: 'Username already taken' });
          return;
        }

        const newUser = new User({ username });
        await newUser.save();

        gameBoard.players.push(newUser._id);
        await gameBoard.save();

        socket.join(gameBoard._id.toString());
        socket.emit('joinedGameBoard', { gameBoardId: gameBoard._id, userId: newUser._id });

        io.to(gameBoard._id.toString()).emit('newPlayer', { message: `New player joined: ${username}` });
      } catch (error) {
        socket.emit('error', { message: 'Error joining gameBoard' });
      }
    });

    socket.on('leaveGameBoard', async ({ gameBoardId, userId }) => {
      try {
        const gameBoard = await GameBoard.findById(gameBoardId);
        if (!gameBoard) {
          socket.emit('error', { message: 'GameBoard not found' });
          return;
        }

        const userIndex = gameBoard.players.indexOf(userId);
        if (userIndex !== -1) {
          gameBoard.players.splice(userIndex, 1);
          await gameBoard.save();
          await User.findByIdAndDelete(userId);

          socket.leave(gameBoardId);
          socket.emit('leftGameBoard', { message: 'User left the gameBoard' });

          io.to(gameBoardId).emit('playerLeft', { message: `Player left: ${userId}` });
        } else {
          socket.emit('error', { message: 'User not found in GameBoard' });
        }
      } catch (error) {
        socket.emit('error', { message: 'Error leaving gameBoard' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    socket.on('sendAction', (data) => {
      console.log('Action received:', data);
      socket.broadcast.emit('actionReceived', data);
    });
  });

  return io;
}

export { io, setupSocket };
