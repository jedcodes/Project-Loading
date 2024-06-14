import { Server as SocketIOServer } from 'socket.io';

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

    socket.on('joinGameBoard', (gameBoardId) => {
      socket.join(gameBoardId);
      console.log(`Client joined gameBoard: ${gameBoardId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('sendAction', (data) => {
      console.log('Action received:', data);
      socket.broadcast.emit('actionReceived', data);
    });

    socket.on('startGame', ({ gameBoardId }) => {
      console.log('Start game event received for gameBoard:', gameBoardId);
      io.to(gameBoardId).emit('startGame');
    });

    socket.on('nextMiniGame', ({ gameBoardId }) => {
      console.log('Next mini-game event received for gameBoard:', gameBoardId);
      io.to(gameBoardId).emit('nextMiniGame');
    });
  });

  return io;
}

export { io, setupSocket };
