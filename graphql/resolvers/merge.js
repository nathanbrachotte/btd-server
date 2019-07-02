
const Session = require('../../models/session')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const sessions = sessionIds => {
  return Session.find({ _id: { $in: sessionIds } })
    .then(sessions => {
      return sessions.map(session => {
        return transformSession(session)
      })
    })
    .catch(err => {
      throw err
    })
}

const singleSession = async sessionId => {
  try {
    const session = await Session.findById(sessionId)
    return transformSession(session)
  } catch (err) {
    throw err
  }
}

const user = userId => {
  return User.findById(userId)
    .then(user => {
      // console.log(user)
      return {
        ...user._doc,
        _id: user.id,
        hostOfSession: sessions.bind(this, user._doc.hostOfSession)
      }
    })
    .catch(err => {
      throw err
    })
}

const transformSession = session => {
  return {
    ...session._doc,
    _id: session._doc._id,
    host: user.bind(this, session._doc.host),
    createdAt: new Date(session._doc.createdAt).toISOString()
  }
}

const transformSong = song => {
  return {
    ...song._doc,
    _id: song.id,
    user: user.bind(this, song._doc.user),
    session: singleSession.bind(this, song._doc.session)
  }
}

// exports.user = user;
// exports.sessions = sessions;
// exports.singleSession = singleSession;
exports.transformSession = transformSession
exports.transformSong = transformSong
