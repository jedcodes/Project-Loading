// services/admin.api.ts
import axios from 'axios';

export const sendAdminMessage = async (gameBoardId: string, message: string) => {
  return axios.post('/admin/send-message', { gameBoardId, message });
};

export const startGameBoard = async (gameBoardId: string) => {
  return axios.post('/admin/start-gameboard', { gameBoardId });
};

export const playNextMiniGame = async (gameBoardId: string) => {
  return axios.post('/admin/play-next-minigame', { gameBoardId });
};

export const endMiniGame = async (gameBoardId: string) => {
  return axios.post('/admin/end-minigame', { gameBoardId });
};
