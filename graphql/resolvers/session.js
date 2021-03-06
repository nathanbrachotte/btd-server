const Session = require('../../models/session')
const User = require('../../models/user')
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
      throw new Error('Unauthentificated')
    }
    // console.log({ args: JSON.stringify(args.sessionInput.createdAt, null, 2) })
    const createdAt = new Date(args.sessionInput.createdAt)
    // console.log({ createdAt })
    const session = new Session({
      host: req.userId,
      name: args.sessionInput.name,
      songs: args.sessionInput.songs,
      guests: args.sessionInput.guests,
      createdAt: new Date().toISOString(),
    })
    // console.log({ session })
    let createdSession
    return session
      .save()
      .then(result => {
        createdSession = transformSession(result)
        // console.log({ createdSession })
        return User.findById(req.userId)
      })
      .then(user => {
        if (!user) {
          throw new Error('User not found.')
        }
        // console.log({ user })
        user.hostOfSession.push(session)
        return user.save()
      })
      .then(result => {
        return createdSession
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  },
}

/*
EXAMPLES:
   mutation {
    createSession(sessionInput:{
      host: "${user.userId}",
      name: "${sessionName}",
      songs: [],
      guests: ["${user.userId}"],
      createdAt: ${Date.now()}
      })
      {
      _id
      host {
        _id
        username
      }
      guests
      name
    }
  }

  subscription {
    sessionUpdated (where: {
      mutation_in: [CREATED, UPDATED]
      updatedFields_contains_some: [guests, songs]
    }) {
      mutation
      updatedFields
      node {
        songs
        guests
      }
      previousValues {
        songs
        guests
      }
  }
}
*/
