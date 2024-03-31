const { User, Thought } = require('../model/index');
const { errorType, errorMsg, errorHandler, generateError } = require('./helpers');

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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            const result = await Thought.findById(req.params.id);

            if (!result) {
                generateError(errorType.NOT_FOUND, errorMsg.thought.THOUGHT_NOT_FOUND);
            }

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
            const user = await User.findOne({ username: req.body.username });

            if (!user) {
                generateError(errorType.NOT_FOUND, errorMsg.user.USER_NOT_FOUND);
            }

            const result = await Thought.create(req.body);

            if (!result) {
                generateError(errorType.CREATE_FAILURE, errorMsg.thought.CREATE_THOUGHT_FAILURE);
            }

            user.thoughts.addToSet(result._id);
            await user.save();

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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            const result = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );

            if (!result) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.thought.UPDATE_THOUGHT_FAILURE);
            }
            
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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            const targetThought = await Thought.findOne({ _id: req.params.id });

            const updateResult = await User.findOneAndUpdate(
                { username: targetThought.username },
                { $pull: {
                    thoughts: targetThought._id
                    }
                }
            );

            if (!updateResult) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.user.UPDATE_USER_FAILURE);
            }

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
            if (req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            const result = Thought.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $addToSet: {
                        reactions: req.body
                    }
                },
                { new: true }
            );

            if (!result) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.thought.UPDATE_THOUGHT_FAILURE);
            }

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
            if (!req.params.reactionId) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_REACTION_ID);
            }

            const thought = await Thought.findOne({ _id: req.params.id });

            if (!thought) {
                generateError(errorType.NOT_FOUND, errorMsg.thought.THOUGHT_NOT_FOUND);
            }

            if (!thought.reactions.find(element => element._id.toString() === req.params.reactionId)) {
                generateError(errorType.NOT_FOUND, errorMsg.thought.REACTION_NOT_FOUND);
            }

            thought.reactions.pull(req.params.reactionId);
            const result = await thought.save();

            if (!result) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.thought.UPDATE_THOUGHT_FAILURE);
            }

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    }
}