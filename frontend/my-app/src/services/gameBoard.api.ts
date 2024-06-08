import axios from "axios";

import { GameBoard } from "@/interface/GameBoard";

export const fetchGameBoard = async (): Promise<GameBoard> => {
  try {
    const response = await axios.get("http://localhost:3000/gameboard", {
      headers: { "Content-type": "application/json" },
    });
   if (response.status !== 200) {
    throw new Error('Error fetching game board');
  }
  return response.data;
  } catch (error) {
    console.error(error);
    return {} as GameBoard;
  }
};