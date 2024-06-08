
type MultipleChoiceProps = { 
  options: string[], 
  votes: number[] 

}

const MultipleChoice = ({ options, votes }: MultipleChoiceProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-4 text-white">Which option do you like the most?</h1>
      <div className={`grid ${options.length === 3 ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-4'}`}>
        {options.map((option, index) => (
          <div 
            key={index} 
            className={`w-full max-w-md mb-2 px-10 py-2 bg-gradient-to-r from-blue-500 to-transparent text-white rounded-full flex justify-between items-center ${option.length === 3 && index === 2 ? 'col-span-2' : ''} `}
          >
            <span>{option}</span>
            <span className="ml-4 bg-white text-blue-500 rounded-full px-2 py-1">{votes[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;

