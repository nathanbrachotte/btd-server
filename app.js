const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Session = require('./models/session')
const User = require('./models/user')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Song {
      _id: ID!
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
    }
    
    type RootMutation {
      createSession(sessionInput: SessionInput): Session
      createUser(userInput: UserInput): User
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    sessions: () => {
      return Session.find()

      // .populate('host')
      // .then(sessions => {
      //   console.log({ sessions })
      //   return sessions.map(session => {
      //     return { ...session._doc, _id: session._doc._id }
      //   })
      // })
      // .catch(err => console.log(err))
    },
    createSession: args => {
      const session = new Session({
        host: '5c5c6e65dc0f45710f454409',
        name: args.sessionInput.name,
        songs: args.sessionInput.songs,
        users: args.sessionInput.users,
        createdAt: new Date(args.sessionInput.createdAt)
      })
      console.log({ session })
      let createdSession
      return session
        .save()
        .then(result => {
          createdSession = { ...result._doc, _id: result._doc._id }
          return User.findById('5c5c6e65dc0f45710f454409')
        }).then(user => {
          if (!user) {
            throw new Error('User not found.')
          }
          console.log({ user })
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
    createUser: args => {
      return User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user) {
            throw new Error('User exists already')
          }
          return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
            username: args.userInput.username,
            createdAt: new Date().toISOString()
          })
          return user.save();
        })
        .then(res => {
          console.log(res)
          return { ...res._doc, password: null };
        })
        .catch(err => { throw err })
    }
  },
  graphiql: true
}));


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@btd-bmpuu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
  .then(() => {
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })
