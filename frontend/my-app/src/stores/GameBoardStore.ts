// src/stores/GameBoardStore.ts
import { useQuery } from '@tanstack/react-query';
import { fetchGameBoard, loadMiniGame, getSequence } from '@/services/gameBoard.api'; // Ensure all imports are correct
import { GameBoard } from '@/interface/GameBoard';

export const useFetchCurrentGameBoard = () => {
  const queryResult = useQuery<GameBoard[]>({
    queryKey: ['gameboard'],
    queryFn: fetchGameBoard,
  });

  console.log('useFetchCurrentGameBoard data:', queryResult.data);
  return queryResult;
};

export const useLoadMiniGame = (gameBoardId: string) => {
  const queryResult = useQuery({
    queryKey: ['minigame', gameBoardId],
    queryFn: () => loadMiniGame(gameBoardId),
  });

  return queryResult;
};

export const useFetchSequenceById = (sequenceId: string) => {
  const queryResult = useQuery({
    queryKey: ['sequence', sequenceId],
    queryFn: () => getSequence(sequenceId),
  });

  return queryResult;
};
