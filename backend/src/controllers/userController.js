import User from '../models/user.js';

// Fetch user data by ID
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

// Update user score
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

// Validate recovery code and retrieve user
export const validateRecoveryCode = async (req, res) => {
    try {
        const user = await User.findOne({ recoveryCode: req.params.recoveryCode });
        if (!user) {
            return res.status(404).json({ message: 'Invalid recovery code' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error validating recovery code', error });
    }
};
