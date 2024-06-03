// FirstPage.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import defaultBackground from '@/assets/images/background-large.png';
import avatar1 from '@/assets/images/avatar1.png';
import avatar2 from '@/assets/images/avatar2.png';
import avatar3 from '@/assets/images/avatar3.png';
import avatar4 from '@/assets/images/avatar4.png';

interface Player {
  name: string;
  avatar: string;
}

interface PlayersContextType {
  players: Player[];
  addPlayer: (player: Player) => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

const PlayersProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayer = (player: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  };

  return (
    <PlayersContext.Provider value={{ players, addPlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};

const FirstPage = () => {
  const [loading, setLoading] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/avatar-selection');
    }, 2000); // 2 seconds
  };

  return (
    <div className="hero-bg flex items-center justify-center h-screen relative">
      {loading ? (
        <div className="text-center">
          <h1 className="loading-text">
            <span className="neon-white">LOAD</span>
            <span className="neon-purple">ING</span>
          </h1>
          <div className="spinner mt-4 mx-auto"></div>
        </div>
      ) : (
        <div className="text-center">
          <form onSubmit={handleJoinGame}>
            <input
              type="text"
              placeholder="Enter Pin Code"
              className="mb-4 p-2 border rounded"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
            <br />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
              JOIN GAME
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const AvatarSelection = () => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const navigate = useNavigate();
  const { addPlayer } = usePlayers();
  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const handleJoinGame = () => {
    if (name && selectedAvatar) {
      addPlayer({ name, avatar: selectedAvatar });
      navigate('/waiting-room');
    }
  };

  return (
    <div className="hero-bg flex flex-col items-center justify-center h-screen p-4" style={{ backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover' }}>
      <h1 className="text-4xl font-bold mb-4 text-white">Choose Your Avatar</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 mb-4 border rounded text-black"
      />
      <div className="mb-4">
        <h2 className="mb-2 text-white">Choose an Avatar:</h2>
        <div className="flex flex-wrap justify-center">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`w-16 h-16 m-2 rounded-full cursor-pointer ${selectedAvatar === avatar ? 'border-4 border-blue-500' : ''}`}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>
      </div>
      <button onClick={handleJoinGame} className="p-2 bg-blue-500 text-white rounded">
        Join Game
      </button>
    </div>
  );
};

const WaitingRoom = () => {
  const { players } = usePlayers();
  const maxVisiblePlayers = 6;
  const totalPlayersRequired = 7;

  return (
    <div className="hero-bg flex flex-col items-center justify-center h-screen text-white" style={{ backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover' }}>
      <h1 className="text-4xl font-bold mb-4">Waiting Room</h1>
      <p className="mb-8 text-lg">Waiting for other players to join...</p>
      <div className="flex flex-wrap justify-center">
        {players.slice(0, maxVisiblePlayers).map((player, index) => (
          <div key={index} className="m-4">
            <img src={player.avatar} alt={`Player ${index + 1}`} className="w-16 h-16 rounded-full" />
            <p className="text-center mt-2">{player.name}</p>
          </div>
        ))}
        {players.length > maxVisiblePlayers && (
          <div className="m-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
              +{players.length - maxVisiblePlayers}
            </div>
            <p className="text-center mt-2">More Players</p>
          </div>
        )}
      </div>
      <p className="mt-8">{players.length}/{totalPlayersRequired} players have joined</p>
    </div>
  );
};

const App = () => {
  return (
    <PlayersProvider>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/avatar-selection" element={<AvatarSelection />} />
        <Route path="/waiting-room" element={<WaitingRoom />} />
      </Routes>
    </PlayersProvider>
  );
};

export default App;
