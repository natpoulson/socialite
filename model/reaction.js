const { Schema } = require('mongoose');
const { formatDate } = require('./helpers');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: new Schema.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate
        }
    }
);

module.exports = reactionSchema;