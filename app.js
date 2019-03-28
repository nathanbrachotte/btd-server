const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const isAuth = require('./middleware/is-auth')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const spotifyRouter = require('./routes/spotify-auth')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors())
app.use(isAuth)

// app.use('/', indexRouter);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
)

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

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@btd-bmpuu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(process.env.PORT || 4000)
    // .then(({ url }) => {
    //   console.log(`Server ready at ${url}`)
    // })
    // .catch(err => {
    //   console.log(err)
    // })
  })
  .catch(err => {
    console.log(err)
  })
