import { Server as SocketIOServer } from 'socket.io';

let io;  // Declare io at the module level

function setupSocket(server) {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        socket.on('joinGame', (gameId) => {
            socket.join(gameId);
            console.log('A user joined game room:', gameId);
            io.to(gameId).emit('newPlayer', { message: `New player joined game ${gameId}` });
        });

        socket.on('leaveGame', (gameId) => {
            socket.leave(gameId);
            console.log('A user left game room:', gameId);
            io.to(gameId).emit('playerLeft', { message: `A player left game ${gameId}` });
        });

        socket.on('gameAction', (data) => {
            console.log('Game action received:', data);
            socket.to(data.gameId).emit('gameUpdate', data);
        });

        socket.on('validateRecoveryCode', (recoveryCode) => {
            // Add logic to handle recovery code validation if needed
            console.log('Recovery code received:', recoveryCode);
        });
    });

    return io;
}

export { io, setupSocket };
