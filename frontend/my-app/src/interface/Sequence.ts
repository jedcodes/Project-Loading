// Define the Sequence interface
export interface Sequence {
    _id: string;
    miniGames: string[];
    miniGameType: string;
    branches: {
      answer: number;
      nextSequence: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }
  