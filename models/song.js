const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songSchema = new Schema({
  session: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spotifyId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Song', songSchema)
