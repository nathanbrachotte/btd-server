const authResolver = require('./auth')
const sessionResolver = require('./session')
const sessionSubscriptionResolver = require('./sessionSubscription')
const songResolver = require('./song')

const rootResolver = {
  ...authResolver,
  ...sessionResolver,
  ...sessionSubscriptionResolver,
  ...songResolver,
}

module.exports = rootResolver
