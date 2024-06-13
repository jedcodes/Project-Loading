import axios from "axios";
import { getToken } from '@/services/authService';
import { GameBoard } from "@/interface/GameBoard";

// This function is used to fetch the current game board
export const fetchGameBoard = async (): Promise<GameBoard> => {
  try {
    const token = getToken();
    const response = await axios.get("http://localhost:3000/gameboard", {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    console.log('GameBoard API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching game board:', error);
    throw error;
  }
};

// This function is used to start the game board
export const startGameBoard = async (id: string): Promise<GameBoard> => {
  try {
    const token = getToken();
    const response = await axios.post(`http://localhost:3000/gameboard/${id}/start`, {}, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
}

// This function is used to end the game board
export const endGameBoard = async (id: string): Promise<GameBoard> => {
  try {
    const token = getToken();
    const response = await axios.post(`http://localhost:3000/gameboard/${id}/end`, {}, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
}
