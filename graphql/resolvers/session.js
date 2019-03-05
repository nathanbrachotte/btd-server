const Session = require('../../models/session')
const { dateToString } = require('../../helpers/date')
const { transformSession } = require('./merge')



module.exports = {
  sessions: () => {
    return Session.find()
      .then(sessions => {
        return sessions.map(session => {
          return transformSession(session)
        })
      })
      .catch(err => console.log(err))
  },
  createSession: (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
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
        createdSession = transformSession(result)
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
}