const { PubSub, withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub() //create a PubSub instance
const SESSION_UPDATED_TOPIC = 'sessionUpdated'

const SONG_ADDED = 'SONG_ADDED'

module.exports = {}
