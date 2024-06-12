
import React, { useState } from 'react';

type MultipleChoiceProps = { 
  options: string[], 
  votes: number[] 
}

const MultipleChoice = ({ options, votes }: MultipleChoiceProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-4 text-white">Which option do you like the most?</h1>
      <div className={`grid ${options.length === 3 ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-4'}`}>
        {options.map((option, index) => (
          <div 
            key={index} 
            onClick={() => handleOptionClick(index)}
            className={`w-full max-w-md mb-2 px-10 py-2 border-4 border-purple-500 rounded-full flex justify-between items-center cursor-pointer ${selectedOption === index ? 'bg-purple-500 text-white' : 'bg-gray-800 text-white'} ${option.length === 3 && index === 2 ? 'col-span-2' : ''}`}
            style={{ minHeight: '3rem', transition: 'background-color 0.3s, color 0.3s' }}
          >
            <span>{option}</span>
            <span className={`ml-4 ${selectedOption === index ? 'bg-purple-500 text-white' : 'text-purple-500 border border-purple-500'} rounded-full px-2 py-1`}>{votes[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;


