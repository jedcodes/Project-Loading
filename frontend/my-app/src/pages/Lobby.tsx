import { Logo } from "@/components"
import { useFetchCurrentGameBoard } from "@/stores/GameBoardStore";

const Lobby = () => {
  const {data:gameBoard, loading } = useFetchCurrentGameBoard()


   
  return (
    <div className="retro-bg">
      <div className="flex justify-center items-center flex-col h-screen gap-6">
        <Logo />
   <div className="flex flex-row flex-wrap  ">
     {
      loading ? <p>Loading...</p> : <ul>
      {gameBoard?.players.map((player) => {
        return <li key={player.id}>{player.username}</li>
      })}
      </ul>
    }
   </div>
      </div>
    </div>
  )
}

export default Lobby