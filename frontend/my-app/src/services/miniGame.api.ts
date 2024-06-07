import { MiniGame } from "@/interface/MiniGame";
import axios from "axios";

const BASE_URL = "https://665654029f970b3b36c50619.mockapi.io";

export const fetchMiniGameById = async (): Promise<MiniGame[]> => {
  try {
    const response = await axios.get(BASE_URL + "/miniGames" , {
      headers: { "content-type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {} as MiniGame[];
  }
}