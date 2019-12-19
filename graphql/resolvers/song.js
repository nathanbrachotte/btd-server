const Song = require('../../models/song')
const Session = require('../../models/session')
// const { dateToString } = require('../../helpers/date')
const { transformSong, transformSession } = require('./merge')
// const { pubsub, ACTIONS } = require('./pubsub')

module.exports = {
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
        duration: args.songInput.duration,
        vote: 0,
      })
      const result = await song.save()

      const resultSessionPush = await fetchedSession.songs.push(result)
      const resultSave = await fetchedSession.save()
      // pubsub.publish(ACTIONS.SONG_ADDED, { newSongAdded: { song: result } })
      // console.log(JSON.stringify(resultSave))
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
    // TODO: Check its the same user that created
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
  upVoteSong: async (args, req) => {
    console.log('HEY THEEERE', args)
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    // TODO: Check its the same user that created
    try {
      const song = await Song.findById(args.songId).populate('session')
      console.log(song)
      song.vote = song.vote + 1
      console.log(song)
      await song.save()
      return song
    } catch (err) {
      throw err
    }
  },
}
