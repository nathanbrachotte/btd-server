var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now().toLocaleString())
  next()
})
// middleware for all routes going to user/*
router.all('/users/*', () => console.log('test'))

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/error', function (req, res, next) {
  res.status(500).json({ error: 'message' })
})

module.exports = router
