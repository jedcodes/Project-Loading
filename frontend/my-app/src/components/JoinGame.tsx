import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import MyInput from './MyInput';
import { Button } from './ui/button';
import { useSignUserIn } from '@/services/user.api';
import { useQueryClient } from '@tanstack/react-query';
import socket  from '@/services/socketIO';
import { useFetchCurrentGameBoard } from '@/stores/GameBoardStore';

const JoinGame = () => {
  const [gamePin, setGamePin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isError: mutationError } = useSignUserIn();

  useEffect(() => {
    socket.on('newPlayer', () => {
      queryClient.invalidateQueries({ queryKey: ['gameboard'] });
    });

    return () => {
      socket.off('newPlayer');
    };
  }, [queryClient]);

  const handleGamePin = () => {
    // Simulating fetching the correct pin code from the backend.
    const pinCode = '123456'; // Replace with actual logic to get the correct pin code.
    if (gamePin === pinCode) {
      setShowUsernameInput(true);
    } else {
      alert('Invalid Game Pin');
      setGamePin('');
    }
  };

  const handleJoinGame = () => {
    mutate(
      { username, pinCode: gamePin },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['gameboard'] });
          setShowUsernameInput(false);
          navigate('/lobby');
        },
        onError: (error: any) => {
          console.error('Error joining game:', error.message);
          alert(error.message);
        },
      }
    );
  };

  return (
    <div className="center-contents">
      <Logo />
      <div className="flex gap-5 flex-col">
        {!showUsernameInput ? (
          <>
            <MyInput placeholder="Enter Game Pin" value={gamePin} type="text" onHandleChange={setGamePin} />
            <Button onClick={handleGamePin}>Enter Pin</Button>
          </>
        ) : (
          <>
            <MyInput placeholder="Enter Username" value={username} type="text" onHandleChange={setUsername} />
            <Button onClick={handleJoinGame}>Join Game</Button>
          </>
        )}
      </div>
      {mutationError && <p className="error">An error occurred while joining the game.</p>}
    </div>
  );
};

export default JoinGame;