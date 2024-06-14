import GameBoard from '../models/gameBoard.js';
import User from '../models/user.js';
import QnA from '../models/minigames/qna.js';
import LoadingScreen from '../models/minigames/loadingScreen.js';
import Sequence from '../models/sequence.js';
import Feedback from '../models/feedback.js';
import { io } from '../config/socketConfig.js';

export const createGameBoard = async (req, res) => {
    try {
        const newGameBoard = new GameBoard(req.body);
        const newGameBoardRes = await newGameBoard.save();
        res.status(201).json({ gameBoard: newGameBoardRes, pinCode: newGameBoardRes.pinCode });
    } catch (error) {
        res.status(500).json({ message: 'Error creating game board', error });
    }
};

export const getAllGameBoards = async (req, res) => {
    try {
        const gameBoards = await GameBoard.find().populate('players');
        res.status(200).json(gameBoards);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving game boards', error });
    }
};

export const getGameBoard = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findOne({ pinCode: req.params.pinCode }).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }
        res.json(gameBoard);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving gameBoard data', error });
    }
};

export const loadMiniGame = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findOne({ pinCode: req.params.pinCode });
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const currentSequence = await Sequence.findById(gameBoard.sequence[gameBoard.currentGameIndex]);
        if (!currentSequence) {
            return res.status(404).json({ message: 'Sequence not found' });
        }

        const currentMiniGameId = currentSequence.miniGames[0];
        let currentMiniGame;

        switch (currentSequence.miniGameType) {
            case 'QnA':
                currentMiniGame = await QnA.findById(currentMiniGameId);
                break;
            case 'LoadingScreen':
                currentMiniGame = await LoadingScreen.findById(currentMiniGameId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid mini-game type' });
        }

        if (!currentMiniGame) {
            return res.status(404).json({ message: 'Mini-game not found' });
        }

        res.json({ gameData: currentMiniGame });
        io.emit('miniGameLoaded', { pinCode: req.params.pinCode, miniGame: currentMiniGame });
    } catch (error) {
        res.status(500).json({ message: 'Error loading mini-game', error });
    }
};

export const updateGameBoard = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findOneAndUpdate({ pinCode: req.params.pinCode }, { $set: req.body }, { new: true }).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }
        res.json(gameBoard);
        io.emit('gameBoardUpdated', { pinCode: req.params.pinCode, gameBoard });
    } catch (error) {
        res.status(500).json({ message: 'Error updating gameBoard', error });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const gameBoard = await GameBoard.findOne({ pinCode: req.params.pinCode }).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }
        const stats = gameBoard.players.map(player => ({
            username: player.username,
            score: player.score,
        }));
        res.json({ stats });
        io.emit('userStatsUpdated', { pinCode: req.params.pinCode, stats });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user stats', error });
    }
};

export const getMiniGamesByType = async (req, res) => {
    const { type } = req.query;

    try {
        let miniGames;
        switch (type) {
            case 'QnA':
                miniGames = await QnA.find();
                break;
            case 'LoadingScreen':
                miniGames = await LoadingScreen.find();
                break;
            default:
                return res.status(400).json({ message: 'Invalid mini-game type' });
        }

        res.json(miniGames);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving mini-games', error });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const gameBoard = await GameBoard.findOne({ pinCode: req.params.pinCode });
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const feedback = new Feedback({ user: userId, rating, comment });
        await feedback.save();

        gameBoard.feedback.push(feedback._id);
        await gameBoard.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};

//

export const removeUserFromGameBoard = async (req, res) => {
    try {
        const { username, pinCode } = req.body;

        const gameBoard = await GameBoard.findById(pinCode).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        gameBoard.players = gameBoard.players.filter(player => player._id.toString() !== user._id.toString());
        await gameBoard.save();

        res.status(200).json({ message: 'User removed from game board' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing user from game board', error });
    }
};

export const getGameBoardById = async (req, res) => {
    try {
      const gameBoard = await GameBoard.findById(req.params.id);
      if (!gameBoard) {
        return res.status(404).json({ message: 'GameBoard not found' });
      }
      res.json(gameBoard);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching game board', error });
    }
  };

  const resetVotes = async () => {
    const qnas = await QnA.find();
    for (const qna of qnas) {
      for (const question of qna.questions) {
        question.options.forEach(option => {
          option.votes = 0;
        });
      }
      await qna.save();
    }
  };
  
  export const startGameSequence = async (req, res) => {
    try {
      const gameBoard = await GameBoard.findById(req.params.gameBoardId);
      if (!gameBoard) {
        return res.status(404).json({ message: 'GameBoard not found' });
      }
  
      gameBoard.isActive = true;
      await gameBoard.save();
  
      io.to(gameBoard._id.toString()).emit('gameStarted', { gameBoard });
  
      res.json({ message: 'Game started successfully', gameBoard });
    } catch (error) {
      res.status(500).json({ message: 'Error starting game', error });
    }
  };
  
  export const moveToNextMiniGame = async (req, res) => {
    try {
      const gameBoard = await GameBoard.findById(req.params.gameBoardId);
      if (!gameBoard) {
        return res.status(404).json({ message: 'GameBoard not found' });
      }
  
      const currentSequence = await Sequence.findById(gameBoard.sequence[gameBoard.currentGameIndex]);
  
      if (!currentSequence) {
        return res.status(404).json({ message: 'Sequence not found' });
      }
  
      if (currentSequence.miniGames.length > 0) {
        const nextMiniGame = currentSequence.miniGames.shift();
        await currentSequence.save();
  
        io.to(gameBoard._id.toString()).emit('nextMiniGame', { nextMiniGame });
  
        res.json({ message: 'Moved to next mini-game', gameBoard, nextMiniGame });
      } else {
        if (gameBoard.currentGameIndex < gameBoard.sequence.length - 1) {
          gameBoard.currentGameIndex += 1;
          await gameBoard.save();
  
          io.to(gameBoard._id.toString()).emit('nextSequence', { gameBoard });
  
          res.json({ message: 'Moved to next sequence', gameBoard });
        } else {
          gameBoard.isActive = false;
          await gameBoard.save();
  
          io.to(gameBoard._id.toString()).emit('gameEnded', { gameBoard });
  
          res.json({ message: 'Game sequence ended', gameBoard });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error moving to next mini-game or sequence', error });
    }
  };
  
  export const endGameSequence = async (req, res) => {
    try {
      const gameBoard = await GameBoard.findById(req.params.gameBoardId);
      if (!gameBoard) {
        return res.status(404).json({ message: 'GameBoard not found' });
      }
  
      gameBoard.isActive = false;
      await gameBoard.save();
  
      // Reset votes for all questions
      await resetVotes();
  
      io.to(gameBoard._id.toString()).emit('gameEnded', { gameBoard });
  
      res.json({ message: 'Game ended successfully', gameBoard });
    } catch (error) {
      res.status(500).json({ message: 'Error ending game', error });
    }
  };