import { GameBoard } from "@/interface/GameBoard";
import { fetchGameBoard } from "@/services/gameBoard.api";
import { useEffect, useState } from "react";

export const useFetchCurrentGameBoard = () => {
  const [data, setData] = useState<GameBoard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGameBoard();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
