const { User, Thought } = require('../model/index');
const { errorType, errorMsg, errorHandler } = require('./helpers');

module.exports = {
    // Get all Thoughts
    async getAll(req, res) {
        try {
            const result = await Thought.find({});

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
        
    },
    // Get one Thought by ID
    async getById(req, res) {
        try {
            const result = await Thought.findById(req.params.id);

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Create new Thought
    async newThought(req, res) {
        try {
            const result = await Thought.create(req.body);

            await User.findOneAndUpdate(
                {username: req.body.username},
                { $addToSet: {
                        thoughts: result._id
                    }
                }
            )

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Update an existing Thought
    async updateThought(req, res) {
        try {
            const result = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );
            
            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Delete a Thought
    async deleteThought(req, res) {
        try {
            const targetThought = await Thought.findOne({ _id: req.params.id });
            console.log(`[!] Removing Thought ${targetThought._id} from ${targetThought.username}`);
            await User.findOneAndUpdate(
                { username: targetThought.username },
                { $pull: {
                    thoughts: targetThought._id
                    }
                }
            );
            console.log(`[!] Removing Thought ${targetThought._id}`);
            const result = await Thought.findOneAndDelete({ _id: targetThought._id });

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Add a reaction to a Thought
    async addReaction(req, res) {
        try {
            const result = Thought.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $addToSet: {
                        reactions: req.body
                    }
                },
                { new: true }
            );

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Remove a reaction from a Thought
    async removeReaction(req, res) {
        try {
            const result = Thought.findOneAndUpdate(
                { _id: req.params.id },
                { 
                    $pull: {
                        reactions: req.params.reactionId
                    }
                },
                { new: true }
            );

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    }
}