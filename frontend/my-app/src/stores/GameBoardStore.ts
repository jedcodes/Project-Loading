import { fetchGameBoard } from "@/services/gameBoard.api";
import { useQuery } from "@tanstack/react-query";

export const useFetchCurrentGameBoard = () => {
  const {data, isLoading, isError} = useQuery({
    queryKey: ['gameboard'],
    queryFn: fetchGameBoard
  })

  console.log('useFetchCurrentGameBoard data:', data);
  return {data, isLoading, isError}
};
