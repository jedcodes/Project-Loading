import { Logo } from "@/components";
import { User } from "@/interface/User";
import { useFetchCurrentGameBoard } from "@/stores/GameBoardStore";
import avatarImage from "@/assets/images/Avatar.png"; 

const Lobby = () => {
  const { data } = useFetchCurrentGameBoard();
  const currentGameboardPlayers = data && Array.isArray(data) ? data.find(item => item.players)?.players : undefined;

  // Show only 4 players in the lobby, but reverse the order to show the latest player first
 const reverted = [...currentGameboardPlayers].reverse()
  const visiblePlayers = reverted?.slice(0, 4);
  const remainingPlayersCount = currentGameboardPlayers?.length > 4 ? currentGameboardPlayers.length - 4 : 0;
 

  return (
    <div className="retro-bg">
      <div className="flex justify-center items-center flex-col h-screen gap-6">
        <Logo />
        <div className="p-6 rounded-3xl bg-gray-800 shadow-lg">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {
              visiblePlayers?.map((player: User) => (
                <div key={player._id} className="flex flex-col items-center p-4 bg-black rounded-xl">
                  <img 
                    src={avatarImage}
                    alt={`${player.username}'s avatar`} 
                    className="h-16 w-16 rounded-full mb-2"
                  />
                  <p className="text-white font-bold">{player.username}</p>
                </div>
              ))
            }
            {
              remainingPlayersCount > 0 && (
                <div className="flex flex-col items-center p-4 bg-black rounded-xl">
                  <p className="text-white font-bold">{remainingPlayersCount}+ other players</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;

