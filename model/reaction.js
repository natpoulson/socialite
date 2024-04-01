const { Schema, Types } = require('mongoose');
const { formatDate } = require('./helpers');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Types.ObjectId,
            default: new Types.ObjectId()
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
    },
    { 
        _id: false, // Avoid auto-generating _id so we rely on reactionId instead
        toJSON: {
            getters: true // Required for get function to work in responses
        }
    } 
);

module.exports = reactionSchema;