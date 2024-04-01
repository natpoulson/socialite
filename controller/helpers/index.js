const errorType = {
    MISSING_PARAM: "E_MissingParam",
    NOT_FOUND: "E_NotFound",
    CREATE_FAILURE: "E_CreateFail",
    UPDATE_FAILURE: "E_UpdateFail",
    MONGO_VALIDATION_FAIL: "ValidationError",
    MONGO_SERVER_ERROR: "MongoServerError",
};

const errorSubType = {
    MONGO_DUPLICATE_KEY: [11000, 11001]
};

const errorMsg = {
    generic: {
        DEFAULT: "An unrecognised error has occurred.",
        MISSING_PARAM: "A required parameter is missing.",
        NOT_FOUND: "No records found matching the given parameters."
    },
    user: {
        MISSING_ID: "No User ID provided.",
        MISSING_FRIEND_ID: "No Friend ID provided.",
        USER_NOT_FOUND: "No User found matching the parameters given.",
        FRIEND_NOT_FOUND: "No Friend found matching the parameters given.",
        CREATE_USER_FAILURE: "Failed to create new User.",
        UPDATE_USER_FAILURE: "Failed to update User."
    },
    thought: {
        MISSING_ID: "No Thought ID provided.",
        MISSING_REACTION_ID: "No Reaction ID provided.",
        THOUGHT_NOT_FOUND: "No Thought found matching the parameters given.",
        REACTION_NOT_FOUND: "No Reaction found matching the parameters given.",
        CREATE_THOUGHT_FAILURE: "Failed to create new Thought.",
        CREATE_REACTION_FAILURE: "Failed to add Reaction.",
        UPDATE_THOUGHT_FAILURE: "Failed to update Thought."
    }
};

module.exports = {
    errorType,
    errorMsg,
    errorHandler(error, debug = false) {
        let respCode;

        switch (error.name) {
            case errorType.MONGO_VALIDATION_FAIL:
            case errorType.MISSING_PARAM:
                respCode = 400;
                break;
            case errorType.NOT_FOUND:
                respCode = 404;
                break;
            case errorType.MONGO_SERVER_ERROR:
                if (errorSubType.MONGO_DUPLICATE_KEY.includes(error.code)) {
                    respCode = 409;
                    break;
                }
                // Default if none of our defined Subtypes have a match
                respCode = 500;
                break;
            default:
                respCode = 500;
                break;
        }

        const errResp = { code: respCode, message: error.message };
        
        if (debug) {
            errResp.detail = error.stack;
        }

        console.error(error);
        return errResp;
    },
    generateError(type, message) {
        const err = new Error(message);
        err.name = type;
        throw err;
    }
}