
const Song = require('../../models/song')
const { dateToString } = require('../../helpers/date')
const { transformSong, transformSession } = require('./merge')

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
      throw err;
    }
  },
  addSong: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const fetchedSession = await Session.findOne({ _id: args.sessionId })
      const song = new Song({
        user: req.userId,
        session: fetchedSession,
        spotifyId: 'spotifyId',
        name: 'namespotify',
        artist: 'artistspotify',
      })
      const result = await song.save()
      //console.log(result._doc)
      return transformSong(result)
    } catch (err) {
      throw err;
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
      throw err;
    }
  }
}