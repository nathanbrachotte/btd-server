const { PubSub, withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub() //create a PubSub instance
const SESSION_UPDATED_TOPIC = 'sessionUpdated'

const SONG_ADDED = 'SONG_ADDED'

module.exports = {
  Subscription: {
    newSongAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(SONG_ADDED),
        (payload, args) => {
          console.log(args)
          return true
          // args.songInput
          //   //Create a mutation to add a new channel.
          //   const newChannel = { id: String(nextId++), messages: [], name: args.name }
          //   channels.push(newChannel)
          //   pubsub.publish(CHANNEL_ADDED_TOPIC, { channelAdded: newChannel }) // publish to a topic
          //   return newChannel
          // },}
        }
      ),
    },
  },
}
