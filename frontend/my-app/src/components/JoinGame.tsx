import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import MyInput from './MyInput';
import { Button } from './ui/button';
import { useFetchCurrentGameBoard } from '@/stores/GameBoardStore';
import { useSignUserIn } from '@/services/user.api';
import { socket } from '@/services/socketIO';
import { useQueryClient } from '@tanstack/react-query';

const JoinGame = () => {
  const [gamePin, setGamePin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data} = useFetchCurrentGameBoard();
  const { mutate } = useSignUserIn();
  const queryClient = useQueryClient();
  const pinCode = data && Array.isArray(data) ? data.find(item => item.pinCode)?.pinCode : undefined;

  useEffect(() => {
    socket.on('newPlayer', () => {
      queryClient.invalidateQueries({
        queryKey: ['game-board']
      });
    });

    return () => {
      socket.off('newPlayer');
    };
  }, [queryClient]);

  const handleGamePin = () => {
    if (gamePin === pinCode) {
      setShowUsernameInput(true);
    } else {
      alert('Invalid Game Pin');
      setGamePin('');
    }
  };

  const handleJoinGame = () => {
    mutate({ username, pinCode: gamePin });
    setShowUsernameInput(false);
    navigate('/lobby');
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
    </div>
  );
};

export default JoinGame;
