const { User, Thought } = require('../model/index');
const { errorType, errorMsg, errorHandler, generateError, isInvalid } = require('./helpers');

module.exports = {
    // Get all Users
    async getAll(req, res) {
        try {
            const response = await User.find({});
            res.status(200).json(response);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Get one user by their ID
    async getById(req, res) {
        try {
            if (isInvalid(req.params.id)) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const response = await User.findById({ _id: req.params.id })
                .populate([
                    { path: "thoughts" },
                    { path: "friends" }
                ]);
            
            if (isInvalid(response)) {
                generateError(errorType.NOT_FOUND, errorMsg.user.USER_NOT_FOUND);
            }

            res.status(200).json(response);
            return;
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Post new user
    async newUser(req, res) {
        try {
            const result = await User.create(req.body);

            if (isInvalid(result)) {
                generateError(errorType.CREATE_FAILURE, errorMsg.user.CREATE_USER_FAILURE);
            }

            res.status(200).json(result);
            return;
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Update user
    async updateUser(req, res) {
        try {
            if (isInvalid(req.params.id)) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const result = await User.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );

            if (isInvalid(result)) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.user.UPDATE_USER_FAILURE);
            }

            res.status(200).json(result);
            return;
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Post friend
    async addFriend(req, res) {
        try {
            if (isInvalid(req.params.id)) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            if (req.params.id === req.params.friendId) {
                generateError(errorType.SELF_REFERENCE, errorMsg.user.FRIEND_ID_SAME_AS_ID);
            }

            // Fetch user and make sure they exist
            const user = await User.findOne({ _id: req.params.id });

            if (isInvalid(user)) {
                generateError(errorType.NOT_FOUND, errorMsg.user.USER_NOT_FOUND);
            }

            // Fetch friend and make sure they exist
            const friend = await User.findOne({ _id: req.params.friendId });

            if (isInvalid(friend)) {
                generateError(errorType.NOT_FOUND, errorMsg.user.FRIEND_NOT_FOUND);
            }

            // Generate the bond
            const userAdd = user.friends.addToSet(friend._id);
            const friendAdd = friend.friends.addToSet(user._id);

            if (isInvalid(userAdd) || isInvalid(friendAdd)) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.user.UPDATE_USER_FAILURE);
            }

            // Commit
            await friend.save();
            const result = await user.save({new: true});

            res.status(200).json(result);
            return;
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Delete user
        // Also delete their thoughts
    async deleteUser(req, res) {
        try {
            if (isInvalid(req.params.id)) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const user = await User.findOne({ _id: req.params.id });

            if (isInvalid(user)) {
                generateError(errorType.NOT_FOUND, errorMsg.user.USER_NOT_FOUND);
            }

            // Remove all the thoughts associated with our user
            for (const thought of user.thoughts) {
                await Thought.findAndDeleteOne({ _id: thought._id });
            }

            // Remove them from any other user who has them as a friend
            for (const friend of user.friends) {
                await User.findOneAndUpdate(
                    { _id: friend },
                    { $pull: user._id }
                );
            }

            const result = await User.findOneAndDelete({ _id: user._id });

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    },
    // Delete friend
    async removeFriend(req, res) {
        try {
            if (isInvalid(req.params.id)) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            if (isInvalid(req.params.friendId)) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_FRIEND_ID);
            }

            // Fetch user and make sure they exist
            const user = await User.findOne({ _id: req.params.id });

            if (isInvalid(user)) {
                generateError(errorType.NOT_FOUND, errorMsg.user.USER_NOT_FOUND);
            }

            // Fetch friend and make sure they exist
            const friend = await User.findOne({ _id: req.params.friendId });

            if (isInvalid(friend)) {
                generateError(errorType.NOT_FOUND, errorMsg.user.FRIEND_NOT_FOUND);
            }

            const userPull = user.friends.pull(req.params.friendId);
            const friendPull = friend.friends.pull(req.params.id);

            if (isInvalid(userPull) || isInvalid(friendPull)) {
                generateError(errorType.UPDATE_FAILURE, errorMsg.user.UPDATE_USER_FAILURE);
            }

            await friend.save();
            const result = await user.save({new: true});

            res.status(200).json(result);
        } catch (error) {
            const errResponse = errorHandler(error);
            res.status(errResponse.code).json(errResponse);
            return;
        }
    }
}