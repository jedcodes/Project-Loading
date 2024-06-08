import { useState } from 'react';

const ClickerEvent = () => {
  const [clickCount, setClickCount] = useState(0);
  const maxClicks = 100;

  const handleButtonClick = () => {
    setClickCount(prevCount => (prevCount < maxClicks ? prevCount + 1 : maxClicks));
  };

  const progressWidth = (clickCount / maxClicks) * 100;

  return (
    <div className="retro-bg center-contents flex flex-col items-center justify-center h-screen">
      <div>ClickerEvent</div>
      <button 
        onClick={handleButtonClick} 
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
      >
        Click me
      </button>
      <div className="w-full bg-gray-300 rounded mt-4 h-6">
        <div 
          className="bg-teal-500 h-full transition-width duration-300" 
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ClickerEvent;