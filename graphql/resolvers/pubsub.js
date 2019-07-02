const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const ACTIONS = {
  SONG_ADDED: 'SONG_ADDED',
  VOTE_UPDATED: 'VOTE_UPDATED',
}

module.exports = { pubsub, ACTIONS }
