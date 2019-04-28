const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub() //create a PubSub instance
const SESSION_UPDATED_TOPIC = 'sessionUpdated'

module.exports = {
  addChannel: (root, args) => {
    //Create a mutation to add a new channel.
    const newChannel = { id: String(nextId++), messages: [], name: args.name }
    channels.push(newChannel)
    pubsub.publish(CHANNEL_ADDED_TOPIC, { channelAdded: newChannel }) // publish to a topic
    return newChannel
  },
}
