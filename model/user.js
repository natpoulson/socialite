const { mongoose, Schema, Types } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: /^[A-Za-z0-9_\.-]+@[\da-z\.-]+\.[a-z\.]{2,10}$/
        },
        thoughts: [
            {
                type: Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
            transform: function (doc, ret, options) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            }
        },
    },
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;