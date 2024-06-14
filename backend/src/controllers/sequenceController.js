import Sequence from '../models/sequence.js';

export const createSequence = async (req, res) => {
    try {
        const newSequence = new Sequence(req.body);
        await newSequence.save();
        res.status(201).json(newSequence);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sequence', error });
    }
};

export const getSequence = async (req, res) => {
    try {
        const sequence = await Sequence.findById(req.params.sequenceId).populate('miniGames');
        if (!sequence) {
            return res.status(404).json({ message: 'Sequence not found' });
        }
        res.json(sequence);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sequence', error });
    }
};

export const updateSequence = async (req, res) => {
    try {
        const sequence = await Sequence.findByIdAndUpdate(req.params.sequenceId, req.body, { new: true });
        if (!sequence) {
            return res.status(404).json({ message: 'Sequence not found' });
        }
        res.json(sequence);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sequence', error });
    }
};
