import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

export default socket;
