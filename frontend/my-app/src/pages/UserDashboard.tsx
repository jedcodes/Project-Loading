import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '@/services/socketIO';
import { GameState } from '@/types/GameState';

const UserDashboard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('gameStarted', (data) => {
      console.log('Game started', data);
      setGameState({ status: 'started', data });
      navigate('/game');
    });

    socket.on('nextMiniGame', (data) => {
      console.log('Next mini-game', data);
      setGameState({ status: 'nextMiniGame', data });
      navigate('/game');
    });

    socket.on('nextSequence', (data) => {
      console.log('Next sequence', data);
      setGameState({ status: 'nextSequence', data });
    });

    socket.on('gameEnded', (data) => {
      console.log('Game ended', data);
      setGameState({ status: 'ended', data });
    });

    return () => {
      socket.off('gameStarted');
      socket.off('nextMiniGame');
      socket.off('nextSequence');
      socket.off('gameEnded');
    };
  }, [navigate]);

  return (
    <div>
      <h1>User Dashboard</h1>
      {gameState && (
        <div>
          <p>Game Status: {gameState.status}</p>
          <pre>{JSON.stringify(gameState.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
