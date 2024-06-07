import axios from "axios";

import { BASE_URL } from "@/config";
import { GameBoard } from "@/interface/GameBoard";

export const fetchGameBoard = async (): Promise<GameBoard> => {
  try {
    const response = await axios.get(BASE_URL + "/gameboard", {
      headers: { "content-type": "application/json" },
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