const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const ACTIONS = {
  NEW_SONG_ADDED: 'NEW_SONG_ADDED',
}

module.exports = { pubsub, ACTIONS }
