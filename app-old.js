const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { ApolloServer, gql } = require('apollo-server-express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const isAuth = require('./middleware/is-auth')
const graphqlSchema = require('./graphql/schema/mySchema')
const graphqlResolvers = require('./graphql/resolvers/index')
const spotifyRouter = require('./routes/spotify-auth')
const PORT = process.env.PORT || 4000

const app = express()
console.log(app.settings.env)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(cors())
app.use(isAuth)

// app.use(express.urlencoded({ extended: false }));
// app.use('/', indexRouter);

app.use('/spotify', spotifyRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  const status = err.status || 500
  res.status(status)
  res.render('error', {
    title: 'Oops',
    message: res.locals.message + ' :(',
    status,
  })
})

const graphqlEndpoint = '/graphql'
// app.use(
//   graphqlEndpoint,
//   graphqlExpress({
//     schema: graphqlSchema,
//     rootValue: graphqlResolvers,
//     graphiql: true,
//   })
// )
// app.use(
//   '/graphiql',
//   graphiqlExpress({
//     endpointURL: graphqlEndpoint,
//     subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
//   })
// )

// const { ApolloServer } = require('apollo-server')

// const server = createServer(app)

const server = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers: graphqlResolvers,
  // subscriptions: {
  //   onConnect: (connectionParams, webSocket) => {
  //     console.log(
  //       `GraphQL Server is now running on http://localhost:${PORT}/graphql`
  //     )

  //     // if (connectionParams.authToken) {
  //     //   return validateToken(connectionParams.authToken)
  //     //     .then(findUser(connectionParams.authToken))
  //     //     .then(user => {
  //     //       return {
  //     //         currentUser: user,
  //     //       }
  //     //     })
  //     // }

  //     // throw new Error('Missing auth token!')
  //   },
  // },
})

server.applyMiddleware({ app, path: graphqlEndpoint })
console.log(server)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@btd-bmpuu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen({ port: process.env.PORT || 4000 }, () => {
      console.log(`🚀   Server ready`)
      console.log(`🚀   Subscriptions ready maybe`)
    })
    // .then(({ url, subscriptionsUrl }) => {

    // })

    // // app.listen(process.env.PORT || 4000)
    // server.listen(PORT, () => {
    //   new SubscriptionServer(
    //     {
    //       execute,
    //       subscribe,
    //       schema: graphqlSchema,
    //       onConnect: () => console.log('Client connected'),
    //     },
    //     {
    //       server,
    //       path: '/subscriptions',
    //     }
    //   )
    //   console.log(
    //     `GraphQL Server is now running on http://localhost:${PORT}/graphql`
    //   )
    // })
  })
  .catch(err => {
    console.log(err)
  })
