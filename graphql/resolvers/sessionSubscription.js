const { withFilter } = require('graphql-subscriptions')
const { pubsub, ACTIONS } = require('./pubsub')

module.exports = {
  Subscription: {
    newSongAdded: {
      subscribe:
        //  withFilter(
        (root, args, context) => {
          console.log({ root, args, context })
          return pubsub.asyncIterator([ACTIONS.SONG_ADDED])
        },
      //   ,
      //   (payload, variables, context, info) => {
      //     console.log({ payload, variables, context, info })
      //     return true

      //     // args.songInput
      //     //   //Create a mutation to add a new channel.
      //     //   const newChannel = { id: String(nextId++), messages: [], name: args.name }
      //     //   channels.push(newChannel)
      //     //   pubsub.publish(CHANNEL_ADDED_TOPIC, { channelAdded: newChannel }) // publish to a topic
      //     //   return newChannel
      //     // },}
      //   }
      // ),
    },
    voteUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ACTIONS.VOTE_UPDATED]),
        (payload, args) => {
          console.log({ payload, args })
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
