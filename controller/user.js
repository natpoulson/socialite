const { User, Thought } = require('../model/index');
const { errorType, errorMsg, errorHandler } = require('./helpers');

module.exports = {
    // Get all Users
    async getAll(req, res) {
        try {
            return await User.find({});
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
                const err = new Error(errorMsg.generic.MISSING_PARAM);
                err.name = errorType.MISSING_PARAM;
                throw err;
            }

            const response = await User.findById(id)
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

    // Post friend

    // Update user

    // Delete user
        // Also delete their thoughts

    // Delete friend
}