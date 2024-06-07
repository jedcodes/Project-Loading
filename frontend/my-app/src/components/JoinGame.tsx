import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import MyInput from './MyInput';
import { Button } from './ui/button';
import { useFetchCurrentGameBoard } from '@/stores/GameBoardStore';
import { signupNewUser, userSignIn } from '@/services/user.api';

const JoinGame = () => {
  const [gamePin, setGamePin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data, loading, error } = useFetchCurrentGameBoard();


  const pinCode = data && Array.isArray(data) ? data.find(item => item.pinCode)?.pinCode : undefined;

  const handleGamePin = () => {
    if (gamePin === pinCode) {
      setShowUsernameInput(true);
    } else {
      alert('Invalid Game Pin');
      setGamePin('');
    }
  };

  const handleJoinGame = async () => {
    if (gamePin !== pinCode) {
      alert('Invalid Game Pin');
      setUsername('');
      setGamePin('');
      setShowUsernameInput(false);
    } else {
     try {
        await signupNewUser(username, gamePin);
        await userSignIn(username, gamePin);
        navigate('/lobby');
        setUsername('');
        setGamePin('');
        setShowUsernameInput(false);
      } catch (error) {
        console.error('Error during signup or sign-in:', error); // Log error details
        alert('An error occurred during sign up or sign-in. Please check the console for more details.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
