const errorType = {
    MISSING_PARAM: "E_MissingParam"
};

const errorMsg = {
    generic: {
        DEFAULT: "An unrecognised error has occurred.",
        MISSING_PARAM: "A required parameter is missing."
    }
};

module.exports = {
    errorType,
    errorMsg,
    errorHandler(error, debug = false) {
        let returnMsg;
        let respCode;

        switch (error.name) {
            case errorType.MISSING_PARAM:
                returnMsg = errorMsg.generic.MISSING_PARAM;
                respCode = 400;
                break;
            default:
                returnMsg = errorMsg.generic.DEFAULT;
                respCode = 500;
                break;
        }

        const errResp = { code: respCode, message: returnMsg };
        
        if (debug) {
            errResp.detail = error.stack;
        }

        console.error(`${returnMsg} `, error);
        return errResp;
    }
}