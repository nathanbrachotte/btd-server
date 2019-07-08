const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    // unique: true, //TODO: Handle error with username being created are the same
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  spotifyIds: {
    type: Array,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  hostOfSession: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
  guestOfSessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
})

module.exports = mongoose.model('User', userSchema)
