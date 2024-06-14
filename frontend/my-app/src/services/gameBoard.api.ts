import axios from 'axios';
import { getToken } from '@/services/authService';
import { GameBoard } from '@/interface/GameBoard';

export const fetchGameBoard = async (): Promise<GameBoard[]> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.get('http://localhost:3000/gameboard', {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching game board:', error);
    throw error;
  }
};

export const fetchGameBoardById = async (id: string): Promise<GameBoard> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.get(`http://localhost:3000/gameboard/byId/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching game board by ID:', error);
    throw error;
  }
};

export const startGameBoard = async (id: string): Promise<GameBoard> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.post(`http://localhost:3000/gameboard/${id}/start`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (response.status !== 200) {
      throw new Error('Error starting game board');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return {} as GameBoard;
  }
};

export const endGameBoard = async (id: string): Promise<GameBoard> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.post(`http://localhost:3000/gameboard/${id}/end`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (response.status !== 200) {
      throw new Error('Error ending game board');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return {} as GameBoard;
  }
};

export const loadMiniGame = async (id: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.get(`http://localhost:3000/gameboard/${id}/minigame`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const moveToNextMiniGame = async (gameBoardId: string): Promise<GameBoard> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.post(`http://localhost:3000/gameboard/${gameBoardId}/next`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (response.status !== 200) {
      throw new Error('Error moving to next mini-game');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getSequence = async (sequenceId: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const response = await axios.get(`http://localhost:3000/sequence/${sequenceId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
