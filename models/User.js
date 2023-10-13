const { Schema, model } = require('mongoose');

//template for User Model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'You gotta use a valid email yo!'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual('friendcount').get(function () {
  return this.friends.length;
});
//cast user model
const User = model('user', userSchema);

module.exports = User;
