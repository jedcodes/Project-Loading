import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { endGameBoard, startGameBoard } from "@/services/gameBoard.api"
import { useFetchCurrentGameBoard } from "@/stores/GameBoardStore"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
  const {data} = useFetchCurrentGameBoard()
  const {logout} = useAuth()
  const navigate = useNavigate()
  const gameBoardId = "6668dc37b5401826d3808c6d"

  const handleStartGame = async () => {
    try {
      await startGameBoard(gameBoardId);
      console.log('Game started successfully');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleEndGame = async () => {
    try {
      await endGameBoard(gameBoardId);
      console.log('Game ended successfully');
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleSignOut = async () => {
    logout();
    navigate('/');
  };

  return ( 
    <div className="retro-bg ">
      <Button onClick={handleSignOut}>Log out</Button>
      <div className="center-contents">
        <Button onClick={handleStartGame}>Start Mini Game</Button>
        <Button onClick={handleEndGame} variant={"destructive"}>End Mini Game</Button>
      </div>
    </div>
  )
}

export default AdminDashboard
