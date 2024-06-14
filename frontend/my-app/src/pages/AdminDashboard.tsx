import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { startGameBoard, endGameBoard, moveToNextMiniGame, fetchGameBoard, fetchGameBoardById } from "@/services/gameBoard.api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameBoard } from "@/interface/GameBoard";
import socket from "@/services/socketIO";

const AdminDashboard = () => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [gameBoards, setGameBoards] = useState<GameBoard[]>([]);
  const [selectedGameBoard, setSelectedGameBoard] = useState<GameBoard | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth');
    } else {
      const fetchAllGameBoards = async () => {
        try {
          const data = await fetchGameBoard();
          setGameBoards(data);
        } catch (error) {
          console.error('Error fetching game boards:', error);
        }
      };
      fetchAllGameBoards();
    }
  }, [isAdmin, navigate]);

  const handleSelectGameBoard = async (gameBoardId: string) => {
    try {
      const data = await fetchGameBoardById(gameBoardId);
      setSelectedGameBoard(data);
    } catch (error) {
      console.error('Error fetching selected game board:', error);
    }
  };

  const handleStartGame = async () => {
    if (!selectedGameBoard) return;
    try {
      await startGameBoard(selectedGameBoard._id);
      console.log('Game started successfully');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleEndGame = async () => {
    if (!selectedGameBoard) return;
    try {
      await endGameBoard(selectedGameBoard._id);
      console.log('Game ended successfully');
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleNextGame = async () => {
    if (!selectedGameBoard) return;
    try {
      await moveToNextMiniGame(selectedGameBoard._id);
      console.log('Moved to next mini-game successfully');
      socket.emit('nextMiniGame', { gameBoardId: selectedGameBoard._id }); // Emit event to notify clients
    } catch (error) {
      console.error('Error moving to next mini-game:', error);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="retro-bg">
      <Button onClick={handleSignOut} className="fixed bottom-0 left-0 m-4">Log out</Button>
      <div className="center-contents">
        <h1 className="text-2xl mb-4">Admin Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-xl">Select Game Board</h2>
          <select onChange={(e) => handleSelectGameBoard(e.target.value)}>
            <option value="">Select a Game Board</option>
            {gameBoards.map((gameBoard) => (
              <option key={gameBoard._id} value={gameBoard._id}>
                {gameBoard.pinCode}
              </option>
            ))}
          </select>
        </div>
        {selectedGameBoard && (
          <div>
            <h2 className="text-xl">Selected Game Board: {selectedGameBoard.pinCode}</h2>
            <Button onClick={handleStartGame}>Start Mini Game</Button>
            <Button onClick={handleEndGame} variant={"destructive"}>End Mini Game</Button>
            <Button onClick={handleNextGame}>Next Mini Game</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
