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
    
    input SongInput {
      sessionId: ID!
      spotifyId: String!
      name: String!
      artist: String!
    }

    input SessionSubscriptionWhereInput {
      mutation_in: [UPDATED]
      updatedFields_contains_some: [guests, songs]
    }
    
    type RootQuery {
      sessions: [Session!]!
      songs: [Song!]!
      login(email: String!, password: String!): AuthData!
    }
    
    type RootMutation {
      createSession(sessionInput: SessionInput): Session
      createUser(userInput: UserInput): User
      addSongToSession(songInput: SongInput) : Session!
      deleteSong(songId: ID!) : Session!
    }

    type RootSubscription {
      sessionUpdated(where: SessionSubscriptionWhereInput): Session
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
      subscription: RootSubscription
    }
  `)
