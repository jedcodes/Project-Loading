// src/pages/Lobby.tsx
import { Logo } from "@/components";
import { User } from "@/interface/User";
import { useFetchCurrentGameBoard } from "@/stores/GameBoardStore";

const Lobby = () => {
  const { data, isError, isLoading } = useFetchCurrentGameBoard();
  const currentGameboardPlayers = data && Array.isArray(data) ? data.find(item => item.players)?.players : [];

  console.log(currentGameboardPlayers);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p>Error loading game board</p>;
  }

  if (!currentGameboardPlayers || currentGameboardPlayers.length === 0) {
    return <p>No players found</p>;
  }

  return (
    <div className="retro-bg">
      <div className="flex justify-center items-center flex-col h-screen gap-6">
        <Logo />
        <div className="flex flex-row flex-wrap">
          {currentGameboardPlayers.map((player: User) => (
            <div key={player._id} className="p-4 rounded-3xl bg-fuchsia-600 m-2">
              <p className="text-white font-bold">{player.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
