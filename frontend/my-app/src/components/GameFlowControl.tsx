import { Scenario } from "@/types";
import { useEffect, useState } from "react";

const GameFlowControl = () => {
  const ws = new WebSocket("ws://your-websocket-server-url");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<
    number | null
  >(null);

  // Fetch All Questions on Component Mount
  useEffect(() => {
    const fetchScenarios = async () => {
      // Replace with your actual fetch logic from the admin dashboard
      const fetchedScenarios: Scenario[] = [
        /* ... your question data here ... */
      ];
      setScenarios(fetchedScenarios);
    };

    fetchScenarios();
  }, []);

  useEffect(() => {
    // Set up WebSocket Event Handlers
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const questionId = parseInt(event.data); // Assuming the message is the question ID
      displayNextScenario(questionId);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      // Clean up WebSocket on component unmount
      ws.close();
    };
  }, []);

  // Function to Display the Next Question (Triggered by Admin)
  const displayNextScenario = (scenarioId: number) => {
    const index = scenarios.findIndex((scenario) => scenario.id === scenarioId);
    if (index !== -1) {
      setCurrentScenarioIndex(index);
    }
  };

  const handleAnswer = (selectedScenario: string) => {
    console.log(selectedScenario);

    // Notify the admin of the answer (optional)
    // ... logic to communicate with the admin dashboard
  };

  return (
    <div>
      {currentScenarioIndex !== null ? (
        <>
          <div>{scenarios[currentScenarioIndex].title}</div>
          {scenarios[currentScenarioIndex].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
        </>
      ) : (
        <div>Waiting for the admin to start the quiz...</div>
      )}
    </div>
  );
};

export default GameFlowControl;
