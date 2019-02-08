const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    required: 'User'
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  songs: {
    type: Array,
    required: true
  },
  guests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Session', sessionSchema);