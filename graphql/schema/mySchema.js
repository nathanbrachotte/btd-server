const { buildSchema } = require('graphql')

module.exports = buildSchema(`

    type Song {
      _id: ID!
      session: Session!
      user: User!
      spotifyId: String!
      name: String!
      artist: String!
      vote: Int!
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
      songs: [Song!]!
      guests: [String!]!
      createdAt: String!
    }

    input SessionInput {
      host: ID!
      name: String!
      songs: [String!]!
      guests: [String!]!
    }

    input UserInput {
      email: String!
      password: String!
      username: String!
    }
    
    input SongInput {
      sessionId: ID!
      spotifyId: String!
      name: String!
      artist: String!
    }

    
    type RootQuery {
      sessions: [Session!]!
      songs: [Song!]!
    }
    
    type RootMutation {
      createSession(sessionInput: SessionInput): Session
      createUser(userInput: UserInput): User
      addSongToSession(songInput: SongInput): Session!
      deleteSong(songId: ID!): Session!
      login(email: String!, password: String!): AuthData!
    }

    type Subscription {
      newSongAdded: Song
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
      subscription: Subscription
    }
  `)

// input SessionSubscriptionWhereInput {
//       mutation_in: [UPDATED]
//       updatedFields_contains_some: [guests, songs]
//     }
