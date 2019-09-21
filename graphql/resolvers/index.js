const authResolver = require('./auth')
const sessionResolver = require('./session')
const sessionSubscriptionResolver = require('./sessionSubscription')
const songResolver = require('./song')
const { pubsub, ACTIONS } = require('../pubsub')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

const rootResolver = {
  // ...authResolver,
  // ...sessionResolver,
  // // ...sessionSubscriptionResolver,
  // ...songResolver,

  Mutation: {
    createUser: (obj, args, context, info) => {
      return User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user) {
            throw new Error('User exists already')
          }
          return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
            username: args.userInput.username,
            createdAt: new Date().toISOString(),
          })
          return user.save()
        })
        .then(res => {
          // console.log(res)
          return { ...res._doc, password: null }
        })
        .catch(err => {
          throw err
        })
    },
  },
  Query: {
    hello: (obj, args, context, info) => {
      console.log({ obj, args, context, info })
      return 'Hello world!'
    },
    songs: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated')
      }
      try {
        const songs = await Song.find()
        if (songs.length === 0) {
          throw new Error('No song found')
        }
        return songs.map(song => {
          return transformSong(song)
        })
      } catch (err) {
        throw err
      }
    },
  },
  Mutation: {
    addSongToSession: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated')
      }
      try {
        const fetchedSession = await Session.findOne({
          _id: args.songInput.sessionId,
        })
        const song = new Song({
          user: req.userId,
          session: fetchedSession,
          spotifyId: args.songInput.spotifyId,
          name: args.songInput.name,
          artist: args.songInput.artist,
          vote: 0,
        })
        const result = await song.save()
        const resultSessionPush = await fetchedSession.songs.push(result)
        const resultSave = await fetchedSession.save()
        console.log('hey there')
        console.log('hey there')
        pubsub.publish(ACTIONS.NEW_SONG_ADDED, {
          newSongAdded: { resultSave },
        })
        // return transformXSong(result)
        return transformSession(resultSave)
      } catch (err) {
        throw err
      }
    },
    deleteSong: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated')
      }
      //TODO: Check its the same user that created
      try {
        console.log(args.songId)
        const song = await Song.findById(args.songId).populate('session')
        console.log(song)
        const session = transformSession(song.session)
        await Song.deleteOne({ _id: args.songId })
        return session
      } catch (err) {
        throw err
      }
    },
  },
  Subscription: {
    newSongAdded: {
      subscribe:
        // withFilter(
        () => {
          console.log(ACTIONS.NEW_SONG_ADDED)
          return pubsub.asyncIterator(ACTIONS.NEW_SONG_ADDED)
        },
    },
  },
}

module.exports = rootResolver
