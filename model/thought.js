const { mongoose, Schema } = require('mongoose');
const Reaction = require('./reaction');
const { formatDate } = require('./helpers');

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
    },
    {
        toJSON: {
            virtuals: true,
            transform: function (doc, ret, options) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            },
            getters: true // Required for getter methods to work
        },
    },
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;