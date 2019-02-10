const { buildSchema } = require('graphql')


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
      hostOfSession: [Session!]
    }

    type Session {
      _id: ID!
      host: User!
      name: String!
      songs: [String!]
      users: [String!]!
      createdAt: String!
    }

    input SessionInput {
      host: String!
      name: String!
      songs: [String!]!
      users: [String!]!
      createdAt: String!
    }

    input UserInput {
      email: String!
      password: String!
      username: String!
    }
    
    type RootQuery {
      sessions: [Session!]!
      songs: [Song!]!
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