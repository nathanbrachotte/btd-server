const bcrypt = require('bcryptjs')

const Session = require('../../models/session')
const User = require('../../models/user')
const Song = require('../../models/song')

const sessions = sessionIds => {
  return Session.find({ _id: { $in: sessionIds } }).
    then(sessions => {
      return sessions.map(session => {
        return {
          ...session._doc,
          _id: session.id,
          createdAt: new Date(session._doc.createdAt).toISOString(),
          host: user.bind(this, session.host)
        }
      })
    })
    .catch(err => {
      throw err;
    })
}

const singleSession = async sessionId => {
  try {
    const session = await Session.findById(sessionId)
    return {
      ...session._doc,
      _id: session.id,
      host: user.bind(this, session.host)
    }
  } catch (err) {
    throw err;
  }
}

const user = userId => {
  return User.findById(userId).
    then(user => {
      // console.log(user)
      return {
        ...user._doc,
        _id: user.id,
        hostOfSession: sessions.bind(this, user._doc.hostOfSession)
      }
    })
    .catch(err => {
      throw err;
    })
}


module.exports = {
  sessions: () => {
    return Session.find()
      .then(sessions => {
        return sessions.map(session => {
          return {
            ...session._doc,
            _id: session._doc._id,
            host: user.bind(this, session._doc.host),
            createdAt: new Date(session._doc.createdAt).toISOString()
          }
        })
      })
      .catch(err => console.log(err))
  },
  songs: async () => {
    try {
      const songs = await Song.find()

      if (songs.length === 0) {
        throw new Error('No song found')
      }

      return songs.map(song => {
        return {
          ...song._doc,
          _id: song.id,
          user: user.bind(this, song._doc.user),
          session: singleSession.bind(this, song._doc.session),
        }
      })
    } catch (err) {
      throw err;
    }
  },
  createSession: args => {
    const session = new Session({
      host: '5c5c6e65dc0f45710f454409',
      name: args.sessionInput.name,
      songs: args.sessionInput.songs,
      users: args.sessionInput.users,
      createdAt: new Date(args.sessionInput.createdAt)
    })
    // console.log({ session })
    let createdSession
    return session
      .save()
      .then(result => {
        createdSession = {
          ...result._doc,
          _id: result._doc._id,
          host: user.bind(this, result._doc.host),
          createdAt: new Date(session._doc.createdAt).toISOString()
        }
        return User.findById('5c5c6e65dc0f45710f454409')
      }).then(user => {
        if (!user) {
          throw new Error('User not found.')
        }
        // console.log({ user })
        user.hostOfSession.push(session)
        return user.save();
      })
      .then(result => {
        return createdSession
      })
      .catch(err => {
        console.log(err)
        throw err;
      });
  },
  createUser: args => {
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
          createdAt: new Date().toISOString()
        })
        return user.save();
      })
      .then(res => {
        // console.log(res)
        return { ...res._doc, password: null };
      })
      .catch(err => { throw err })
  },
  addSong: async args => {
    try {
      const fetchedSession = await Session.findOne({ _id: args.sessionId })
      const song = new Song({
        user: '5c5c6e65dc0f45710f454409',
        session: fetchedSession,
        spotifyId: 'spotifyId',
        name: 'namespotify',
        artist: 'artistspotify',
      })
      const result = await song.save()
      //console.log(result._doc)
      return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, song.user),
        session: singleSession.bind(this, fetchedSession),
        createdAt: result._doc.createdAt,
        updateAt: result._doc.createdAt
      }
    } catch (err) {
      throw err;
    }
  },
  deleteSong: async args => {
    try {
      console.log(args.songId)
      const song = await Song.findById(args.songId).populate('session')
      console.log(song)
      const session = {
        ...song.session._doc,
        _id: song.session.id,
        host: user.bind(this, song.session._doc.host)
      }
      await Song.deleteOne({ _id: args.songId })
      return session
    } catch (err) {
      throw err;
    }
  }
}