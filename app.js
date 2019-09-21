require('dotenv').config()

const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const mongoose = require('mongoose')

const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')

const isAuth = require('./middleware/is-auth')

const port = process.env.PORT || 4000
const typeDefs = require('./graphql/schema/mySchema')
const resolvers = require('./graphql/resolvers/index')
console.log({ typeDefs, resolvers })

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   subscriptions: {
//     onConnect: (connectionParams, webSocket) => {
//       console.log(connectionParams, webSocket)
//       console.log('connected 🎉🎉🎉🎉🎉')
//       return true
//       // if (connectionParams.authToken) {
//       //   return validateToken(connectionParams.authToken)
//       //     .then(findUser(connectionParams.authToken))
//       //     .then(user => {
//       //       return {
//       //         currentUser: user,
//       //       }
//       //     })
//       // }

//       // throw new Error('Missing auth token!')
//     },
//   },
// })

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(cors())
app.use(isAuth)

const server = createServer(app)

// server.applyMiddleware({ app })

const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')

app.use(
  graphqlEndpoint,
  bodyParser.json(),
  fileMiddleware,
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET,
      SECRET2,
      channelLoader: new DataLoader(ids =>
        channelBatcher(ids, models, req.user)
      ),
      userLoader: new DataLoader(ids => userBatcher(ids, models)),
      serverUrl: `${req.protocol}://${req.get('host')}`,
    },
  }))
)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@btd-bmpuu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    server.listen(port, () => {
      console.log(`GraphQL Server is now running on http://localhost:${port}`)
      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer({
        execute,
        subscribe,
        schema: typeDefs,
        onConnect: async ({ token, refreshToken }, webSocket) => {
          console.log('COUCOU')
          if (token && refreshToken) {
            try {
              const { user } = jwt.verify(token, SECRET)
              return { models, user }
            } catch (err) {
              const newTokens = await refreshTokens(
                token,
                refreshToken,
                models,
                SECRET,
                SECRET2
              )
              return { models, user: newTokens.user }
            }
          }

          return { models }
        },
      })
    })
    // app.listen({ port }, () =>
    //   console.log(
    //     `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    //   )
    // )
  })
  .catch(err => {
    console.log(err)
  })
