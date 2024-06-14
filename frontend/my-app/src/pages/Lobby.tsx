import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios
import socket from '@/services/socketIO';
import { useFetchCurrentGameBoard } from '@/stores/GameBoardStore';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components';
import avatarImage from '@/assets/images/Avatar.png';
import { User } from '@/interface/User';

const Lobby: React.FC = () => {
  const { gameBoardId } = useParams();
  const navigate = useNavigate();
  const { data, isError, isLoading } = useFetchCurrentGameBoard();

  useEffect(() => {
    if (gameBoardId) {
      socket.emit('joinGameBoard', gameBoardId);
    }

    socket.on('nextMiniGame', (data) => {
      console.log('Received nextMiniGame event:', data);
      navigate('/game');
    });

    return () => {
      socket.off('nextMiniGame');
    };
  }, [gameBoardId, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data || data.length === 0) {
    return <p>Error loading game board</p>;
  }

  const gameBoard = data[0];
  const currentGameboardPlayers = gameBoard.players;

  if (!currentGameboardPlayers || !currentGameboardPlayers.length) {
    return <p>No players found</p>;
  }

  const visiblePlayers = [...currentGameboardPlayers].reverse().slice(0, 4);
  const remainingPlayersCount = currentGameboardPlayers.length > 4 ? currentGameboardPlayers.length - 4 : 0;

  const handleLogout = async () => {
    const username = localStorage.getItem('username');
    const pinCode = localStorage.getItem('gameBoardPinCode');

    if (!username || !pinCode) {
      console.error('Username or gameBoardPinCode is missing from localStorage');
      return;
    }

    console.log(`Sending request to remove user: ${username} from game board with pin code: ${pinCode}`);

    try {
      await axios.post('http://localhost:3000/user/remove', { username, pinCode });
      console.log(`User ${username} removed successfully`);
    } catch (error) {
      console.error('Error removing user:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('gameBoardPinCode');
    navigate('/');
  };

  return (
    <div className="retro-bg relative">
      <div className="flex justify-center items-center flex-col h-screen gap-6">
        <Logo />
        <div className="p-6 rounded-3xl bg-gray-800 shadow-lg">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {visiblePlayers.map((player: User) => (
              <div key={player._id} className="flex flex-col items-center p-4 bg-black rounded-xl">
                <img 
                  src={avatarImage}
                  alt={`${player.username}'s avatar`} 
                  className="h-16 w-16 rounded-full mb-2"
                />
                <p className="text-white font-bold">{player.username}</p>
              </div>
            ))}
            {remainingPlayersCount > 0 && (
              <div className="flex flex-col items-center p-4 bg-black rounded-xl">
                <p className="text-white font-bold">{remainingPlayersCount}+ other players</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button onClick={handleLogout} className="absolute bottom-4 left-4">
        Quit
      </Button>
    </div>
  );
};

export default Lobby;
