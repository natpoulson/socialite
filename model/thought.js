const { Schema } = require('mongoose');

const thoughtSchema = new Schema(
    {
        // Schema goes here
    }
);

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;