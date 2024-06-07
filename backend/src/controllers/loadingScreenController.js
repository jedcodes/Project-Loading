import LoadingScreen from '../models/minigames/loadingScreen.js';

/**
 * Set loading screen text
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const setLoadingScreenText = async (req, res) => {
    const { text } = req.body;
    
    try {
        const loadingScreen = await LoadingScreen.findOneAndUpdate({}, { text }, { new: true, upsert: true });
        res.status(200).json({ message: 'Loading screen text set successfully', loadingScreen });
    } catch (error) {
        res.status(500).json({ message: 'Error setting loading screen text', error });
    }
};

/**
 * Get loading screen text
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLoadingScreenText = async (req, res) => {
    try {
        const loadingScreen = await LoadingScreen.findOne();
        if (!loadingScreen) {
            return res.status(404).json({ message: 'Loading screen text not found' });
        }
        res.status(200).json({ loadingScreen });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loading screen text', error });
    }
};

/**
 * Get all loading screens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllLoadingScreens = async (req, res) => {
    try {
        const loadingScreens = await LoadingScreen.find();
        res.status(200).json({ loadingScreens });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loading screens', error });
    }
};
