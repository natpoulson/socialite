const { User, Thought } = require('../model/index');
const { errorType, errorMsg, errorHandler, generateError } = require('./helpers');

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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const response = await User.findById({ _id: req.params.id })
                .populate([
                    { path: "thoughts" },
                    { path: "friends" }
                ]);

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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const result = await User.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );
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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const result = await User.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $addToSet: {
                        friends: req.params.friendId
                    }
                },
                { new: true }
            );

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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const user = await User.findOne({ _id: req.params.id });

            for (const thought of user.thoughts) {
                console.log(`[!] Deleting thought: ${thought._id}`);
                await Thought.findAndDeleteOne({ _id: thought._id });
            }

            console.log(`[!] Deleting user: ${user.username} (${user._id})`);
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
            if (!req.params.id) {
                generateError(errorType.MISSING_PARAM, errorMsg.user.MISSING_ID);
            }

            const result = await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $pull: { friends: req.params.friendId }
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