// const { buildSchema } = require('graphql')
const { gql } = require('apollo-server')

module.exports = gql`
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

  type Query {
    hello(hello: String): String
    sessions: [Session!]!
    songs(hello: String!): [Song!]!
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    createSession(sessionInput: SessionInput): Session
    createUser(userInput: UserInput): User
    addSongToSession(songInput: SongInput): Session!
    deleteSong(songId: ID!): Session!
  }

  type Subscription {
    newSongAdded: Session
    voteAdded: Session
  }
`
//  # schema {
//   #   query: RootQuery
//   #   mutation: RootMutation
//   #   subscription: Subscription
//   # }

// input SessionSubscriptionWhereInput {
//       mutation_in: [UPDATED]
//       updatedFields_contains_some: [guests, songs]
//     }
