<<<<<<< HEAD
const { buildSchema } = require("graphql");
=======
const { buildSchema } = require('graphql')
>>>>>>> c6a6a5d5931fd6bce908a18d7e3598fd90f575f7

module.exports = buildSchema(`

    type Song {
      _id: ID!
      session: Session!
      user: User!
      spotifyId: String!
      name: String!
      artist: String!
      createdAt: String!
      updatedAt: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      username: String
      hostOfSession: [Session!]
    }

    type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }

    type Session {
      _id: ID!
      host: User!
      name: String!
      songs: [String!]
      guests: [String!]!
      createdAt: String!
    }

    input SessionInput {
      host: String!
      name: String!
      songs: [String!]!
      guests: [String!]!
      createdAt: Float!
    }

    input UserInput {
      email: String!
      password: String!
      username: String!
    }
    
    type RootQuery {
      sessions: [Session!]!
      songs: [Song!]!
      login(email: String!, password: String!): AuthData!
    }
    
    type RootMutation {
      createSession(sessionInput: SessionInput): Session
      createUser(userInput: UserInput): User
      addSong(sessionId: ID!) : Song!
      deleteSong(songId: ID!) : Session!
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)
