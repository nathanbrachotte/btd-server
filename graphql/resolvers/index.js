const authResolver = require('./auth')
const sessionResolver = require('./session')
const songResolver = require('./song')

const rootResolver = {
  ...authResolver,
  ...sessionResolver,
  ...songResolver
}

module.exports = rootResolver