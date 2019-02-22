const bcrypt = require('bcryptjs')
const User = require('../../models/user')


module.exports = {
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
        // console.log(res)
        return { ...res._doc, password: null };
      })
      .catch(err => { throw err })
  },
}