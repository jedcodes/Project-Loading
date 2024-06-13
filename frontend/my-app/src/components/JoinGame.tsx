import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import MyInput from './MyInput';
import { Button } from './ui/button';
import { useFetchCurrentGameBoard } from '@/stores/GameBoardStore';
import { useSignUserIn } from '@/services/user.api';
import socket from '@/services/socketIO';
import { useQueryClient } from '@tanstack/react-query';
import { login, isAuthenticated } from '@/services/authService';

const JoinGame = () => {
  const [gamePin, setGamePin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchCurrentGameBoard();
  const { mutate, isError: mutationError } = useSignUserIn();
  const queryClient = useQueryClient();
  const pinCode = data && Array.isArray(data) ? data.find(item => item.pinCode)?.pinCode : undefined;

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedGameBoardId = localStorage.getItem('gameBoardId');

    if (storedUsername && storedGameBoardId) {
      navigate(`/lobby/${storedGameBoardId}`);
    }

    socket.on('newPlayer', () => {
      queryClient.invalidateQueries({ queryKey: ['gameboard'] });
    });

    return () => {
      socket.off('newPlayer');
    };
  }, [queryClient, navigate]);

  const handleGamePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (gamePin === pinCode) {
      setShowUsernameInput(true);
    } else {
      alert('Invalid Game Pin');
      setGamePin('');
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { username, pinCode: gamePin },
      {
        onSuccess: async () => {
          try {
            const response = await login(username, gamePin);
            socket.auth = { token: response.token };
            socket.connect();
            queryClient.invalidateQueries({ queryKey: ['gameboard'] });
            setShowUsernameInput(false);
            navigate(`/lobby/${gamePin}`);
          } catch (error: any) {
            console.error('Error joining game:', error.message);
            alert(error.message);
          }
        },
        onError: (error: any) => {
          console.error('Error joining game:', error.message);
          alert(error.message);
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: </div>;
  }

  return (
    <div className="center-contents">
      <Logo />
      <div className="flex gap-5 flex-col">
        {!showUsernameInput ? (
          <form onSubmit={handleGamePin}>
            <MyInput placeholder="Enter Game Pin" value={gamePin} type="text" onHandleChange={setGamePin} />
            <Button type="submit">Enter Pin</Button>
          </form>
        ) : (
          <form onSubmit={handleJoinGame}>
            <MyInput placeholder="Enter Username" value={username} type="text" onHandleChange={setUsername} />
            <Button type="submit">Join Game</Button>
          </form>
        )}
      </div>
      {mutationError && <p className="error">An error occurred while joining the game.</p>}
    </div>
  );
};

export default JoinGame;
