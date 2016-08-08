'use strict'

var restify = require('restify')
var msRest = require('ms-rest')
var Connector = require('botconnector')
const Memes = require('./lib/memes')
const memes = new Memes()

// Initialize server
var server = restify.createServer()
server.use(restify.authorizationParser())
server.use(restify.bodyParser())

// Initialize credentials for connecting to Bot Connector Service
var appId = process.env.appId || 'textmeme'
var appSecret = process.env.appSecret || 'ec470402ed6d4f2c9e40e597bc4cff73'
var credentials = new msRest.BasicAuthenticationCredentials(appId, appSecret)

// Handle incoming message
server.post('/v1/messages', verifyBotFramework(credentials), (req, res) => {
  var msg = req.body
  console.log(req.body.text)
  const [name] = req.body.text.split(';')
  sendMessage(name)

  if (name === 'memes') {
    console.log('get list of memes')
    return memes.returnAvailableMemes(req, msg, res)
  } else {
    console.log('get one meme')
    return memes.returnMeme(req, res)
  }
})

// Start server
server.listen(process.env.PORT || 5000, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Middleware to verfiy that requests are only coming from the Bot Connector Service
function verifyBotFramework (credentials) {
  return function (req, res, next) {
    if (req.authorization &&
        req.authorization.basic &&
        req.authorization.basic.username === credentials.userName &&
        req.authorization.basic.password === credentials.password) {
      next()
    } else {
      res.send(403)
    }
  }
}

// Helper function to send a Bot originated message to the user.
function sendMessage (msg) {
  var client = new Connector(credentials)
  var options = {customHeaders: {'Ocp-Apim-Subscription-Key': credentials.password}}
  client.messages.sendMessage(msg, options, function (err, result, request, response) {
    if (!err && response && response.statusCode >= 400) {
      console.log(response.statusMessage)
      err = new Error('Message rejected with ' + response.statusMessage)
    }
  })
}
