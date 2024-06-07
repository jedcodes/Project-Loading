// controllers/loadingScreenController.js
import LoadingScreen from '../models/minigames/loadingScreen.js';

// Set Loading Screen Text
export const setLoadingScreenText = async (req, res) => {
    const { text } = req.body;

    try {
        let loadingScreen = await LoadingScreen.findOne({});
        if (!loadingScreen) {
            loadingScreen = new LoadingScreen({ text });
        } else {
            loadingScreen.text = text;
        }

        await loadingScreen.save();
        res.status(200).json(loadingScreen);
    } catch (error) {
        res.status(400).json({ message: 'Error setting loading screen text', error });
    }
};

// Get Loading Screen Text
export const getLoadingScreenText = async (req, res) => {
    try {
        const loadingScreen = await LoadingScreen.findOne({});
        if (!loadingScreen) {
            return res.status(404).json({ message: 'Loading screen text not found' });
        }
        res.json(loadingScreen);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loading screen text', error });
    }
};
