const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

module.exports = {
  createUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        console.log({ user })
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
          createdAt: new Date().toISOString(),
        })
        return user.save()
      })
      .then(res => {
        // console.log(res)
        return { ...res._doc, password: null }
      })
      .catch(err => {
        console.log({ err })
        throw err
      })
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email })
    if (!user) {
      console.log('No User found')
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      console.log('Password is wrong')
      throw new Error('Password is incorrect!')
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '30 days',
      }
    )
    return { userId: user.id, token: token, tokenExpiration: 1 * 24 * 30 }
  },
}

/*
query {
      login(email: "${emailText}", password: "${passwordText}") {
        userId,
        token,
        tokenExpiration
      }
}
  mutation {
  createUser(userInput:{email: "${emailText}", password: "${passwordText}", username:"${usernameText}"}) {
    _id,
    email
  }
}
*/
