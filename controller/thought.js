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
            // Missing ID
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            const result = await Thought.findById(req.params.id);

            // Thought Not found
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

            // User not found
            if (!user) {
                generateError(errorType.NOT_FOUND, errorMsg.user.USER_NOT_FOUND);
            }

            const result = await Thought.create(req.body);

            // Update failure
            if (!result) {
                generateError(errorType.CREATE_FAILURE, errorMsg.thought.CREATE_THOUGHT_FAILURE);
            }

            // Add thought to user
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
            // Missing ID
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            const result = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );

            // Update failed
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
            // Missing ID
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            // Get the thought we're deleting so we can delete its references
            const targetThought = await Thought.findOne({ _id: req.params.id });

            // Wipe referenced thought from author records
            const updateResult = await User.findOneAndUpdate(
                { username: targetThought.username },
                { $pull: {
                    thoughts: targetThought._id
                    }
                }
            );

            // Update failure
            if (!updateResult) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.user.UPDATE_USER_FAILURE);
            }

            // Delete the thought itself
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
            // Missing ID
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            // Add reaction to thought
            const result = Thought.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $addToSet: {
                        reactions: req.body
                    }
                },
                { new: true }
            );

            // Update failure
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
            // Missing ID
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_ID);
            }

            // Missing reaction ID
            if (!req.params.reactionId) {
                generateError(errorType.MISSING_PARAM, errorMsg.thought.MISSING_REACTION_ID);
            }

            const thought = await Thought.findOne({ _id: req.params.id });

            // Can't find parent thought
            if (!thought) {
                generateError(errorType.NOT_FOUND, errorMsg.thought.THOUGHT_NOT_FOUND);
            }

            // Can't find reaction
            if (!thought.reactions.find(element => element._id.toString() === req.params.reactionId)) {
                generateError(errorType.NOT_FOUND, errorMsg.thought.REACTION_NOT_FOUND);
            }

            // Remove the reaction and commit the result
            thought.reactions.pull(req.params.reactionId);
            const result = await thought.save();

            // Update failure
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