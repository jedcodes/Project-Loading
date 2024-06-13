import { useEffect, useState } from 'react';
import axios from 'axios';

type MultipleChoiceProps = { 
  description: string
}

const MultipleChoice = ({ description }: MultipleChoiceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentQuestion = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:3000/qna/current-question`, {
          params: { description },
          headers: {
          Authorization: `Bearer ${token}`
          }
        });
        setCurrentQuestion(response.data);
      } catch (error) {
        console.error('Error fetching current question:', error);
      }
    };

    fetchCurrentQuestion();
  }, [description]);

  const handleOptionClick = async (index: number) => {
    setSelectedOption(index);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/qna/submit-answer/${currentQuestion._id}`, {
        answerIndex: index
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refetch the question to update the votes
      const response = await axios.get(`http://localhost:3000/qna/current-question`, {
        params: { description },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentQuestion(response.data);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-4 text-white">{currentQuestion.questionText}</h1>
      <div className={`grid ${currentQuestion.options.length === 3? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-4'}`}>
        {currentQuestion.options.map((option: any, index: number) =>  (
          <div 
            key={index} 
            onClick={() => handleOptionClick(index)}
            className={`w-full max-w-md mb-2 px-10 py-2 border-4 border-purple-500 rounded-full flex justify-between items-center cursor-pointer ${selectedOption === index ? 'bg-purple-500 text-white' : 'bg-gray-800 text-white'} ${option.length === 3 && index === 2 ? 'col-span-2' : ''}`}
            style={{ minHeight: '3rem', transition: 'background-color 0.3s, color 0.3s' }}
          >
            <span>{option}</span>
            <span className={`ml-4 ${selectedOption === index ? 'bg-purple-500 text-white' : 'text-purple-500 border border-purple-500'} rounded-full px-2 py-1`}>{option.votes}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;


