import User from '../models/user.js';
import GameBoard from '../models/gameBoard.js';
import Blacklist from '../models/blacklist.js';
import { io } from '../config/socketConfig.js';


// Section: Fetch User Data
/**
// Fetch all users
* @route GET /users/:userId
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

export const removeUserFromGameBoard = async (req, res) => {
    try {
        const { username, pinCode } = req.body;
        console.log(`Removing user: ${username} from game board with pin code: ${pinCode}`);

        const gameBoard = await GameBoard.findOne({ pinCode }).populate('players');
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`Game board found: ${gameBoard._id}, User found: ${user._id}`);

        gameBoard.players = gameBoard.players.filter(player => player._id.toString() !== user._id.toString());
        await gameBoard.save();

        await User.deleteOne({ username });

        console.log(`User ${username} removed from game board with pin code ${pinCode}`);

        res.status(200).json({ message: 'User removed from game board' });
    } catch (error) {
        console.error('Error removing user from game board:', error);
        res.status(500).json({ message: 'Error removing user from game board', error });
    }
};




// Section: Fetch User Data
/**
 * Fetch user data by ID
 * @route GET /users/:userId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error });
    }
};

// Section: Update User Score
/**
 * Update user score
 * @route PUT /users/:userId/score
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUserScore = async (req, res) => {
    try {
        const { score } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, { score }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user score', error });
    }
};

// Section: Remove Inactive User
/**
 * Remove inactive user
 * @route DELETE /users/:userId/gameboards/:gameBoardId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const removeInactiveUser = async (req, res) => {
    try {
        const { userId, gameBoardId } = req.params;
        const gameBoard = await GameBoard.findById(gameBoardId);
        if (!gameBoard) {
            return res.status(404).json({ message: 'GameBoard not found' });
        }

        const userIndex = gameBoard.players.indexOf(userId);
        if (userIndex !== -1) {
            gameBoard.players.splice(userIndex, 1);
            await gameBoard.save();
            await User.findByIdAndDelete(userId);
            res.json({ message: 'Inactive user removed' });
            // Emit event to notify clients about user removal
            io.to(gameBoardId).emit('userRemoved', { userId });
        } else {
            res.status(404).json({ message: 'User not found in GameBoard' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing inactive user', error });
    }
};

// Section: username filtering 
/**
 * Filtering and blacklisting usernames
 * @route POST /users/:userId/gameboards/:gameBoardId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const filterUsername = async (req, res, next) => {
    try {
        const { username } = req.body;
        const blacklisted = await Blacklist.findOne({ username });
        if (blacklisted) {
            return res.status(400).json({ message: 'Username is not allowed' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking username', error });
    }
};
// Section: Update User Vote
/**
 * Update user vote
 * @route POST /users/:userId/vote
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUserVote = async (req, res) => {
    try {
        const { userId } = req.params;
        const { questionId, optionIndex } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if the user has already voted for this question
        if (user.state.get('votes') && user.state.get('votes')[questionId] !== undefined) {
            return res.status(400).json({ message: 'User has already voted for this question' });
        }

        // Update the user's vote
        const votes = user.state.get('votes') || {};
        votes[questionId] = optionIndex;
        user.state.set('votes', votes);
        await user.save();

        // Update the vote count in the question
        question.options[optionIndex].votes += 1;
        await question.save();

        res.json({ message: 'Vote recorded successfully', question });
    } catch (error) {
        res.status(500).json({ message: 'Error recording vote', error });
    }
};
