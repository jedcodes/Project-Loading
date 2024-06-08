import { fetchGameBoard } from "@/services/gameBoard.api";
import { useQuery } from "@tanstack/react-query";

export const useFetchCurrentGameBoard = () => {
  const {data, isLoading, isError} = useQuery({
    queryKey: ['gameboard'],
    queryFn: fetchGameBoard
  })

  return {data, isLoading, isError}
};
