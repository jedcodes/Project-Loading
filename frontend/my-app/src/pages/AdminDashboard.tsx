import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { endGameBoard, startGameBoard } from "@/services/gameBoard.api"
import { useFetchCurrentGameBoard } from "@/stores/GameBoardStore"

const AdminDashboard = () => {
  const {data} = useFetchCurrentGameBoard()
  const {logout} = useAuth()

  // This function is used to start the game board
const handleStartGame = async () => {
    if(data?.id){
      try {
        await startGameBoard(data.id)
      } catch (error) {
        console.error(error)
  }
}
}

// This function is used to end the game board
const handleEndGame = async () => {
  try {
    if(data?.id) {
      await endGameBoard(data?.id)
    }
  
  } catch(error) {
    console.error(error)
  
  }
}

// This function is used to sign out Admin
const handleSignOut = async () => {
  await logout()
}

  return ( 
    <div className="bg-slate-800 ">
      <Button onClick={handleSignOut}>Log out</Button>
    <div className="center-contents">
      <Button onClick={handleStartGame}>Start Mini Game</Button>
      <Button onClick={handleEndGame} variant={"destructive"}>End Mini Game</Button>
    </div>
    </div>
  )
}

export default AdminDashboard