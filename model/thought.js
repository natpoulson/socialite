const { Schema } = require('mongoose');
const Reaction = require('./reaction');
const moment = require('moment');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [ Reaction ]
    }
);
// Getter for date
function formatDate(date) {
    return moment(date).format('YYYY-MM-DD at HH:mm');
}

// Virtual for reactionCount

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;