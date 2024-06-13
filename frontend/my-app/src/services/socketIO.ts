import { io } from 'socket.io-client';
import { getToken } from '@/services/authService';

const socket = io('http://localhost:3000', {
  auth: {
    token: getToken(),
  },
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;
