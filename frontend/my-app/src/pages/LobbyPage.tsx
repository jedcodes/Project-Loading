import React from 'react';



const LobbyPage: React.FC = () => {
    const handleAvatarClick = () => {
        // Placeholder for the click event handler
        console.log('Avatar clicked! Implement avatar change here.');

    }

    return (
        <div className="hero-bg flex flex-col justify-center items-center h-screen bg-gray-100 relative">
            <div className="absolute top-20 text-6xl font-bold text-transparent bg-clip-text">
                <span className="bg-gradient-to-r from-gray-800 to-gray-300 bg-clip-text text-transparent">
                    LOAD
                </span>
                <span className="bg-gradient-to-r from-gray-300 via-purple-900 to-purple-2000 bg-clip-text text-transparent">
                    ING
                </span>
            </div>
            <div className="flex flex-col justify-center items-center h-full">
                <div className="bg-gray-500 bg-opacity-70 text-white p-5 rounded-lg text-center text-xl md:text-2xl mb-10">
                    Today's play is "Rødhette og ulven: en interaktiv fortelling." 
                </div>
                <button className="bg-blue-500 text-white py-2 px-6 rounded-full mt-10 hover:bg-blue-700">
                    CONTINUE
                </button>
            </div>
            <div 
                className="absolute bottom-10 cursor-pointer" 
                onClick={handleAvatarClick}
            >
                <img 
                    src ="/avatar.png"
                    alt="Avatar" 
                    className="rounded-full w-20 h-20"
                />
            </div>
        </div>
    );
};

export default LobbyPage;