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
server.post('/v1/messages', verifyBotFramework(credentials), function (req, res) {
  var msg = req.body
  console.log(req.body.text)
  const [name] = req.body.text.split(';')
  sendMessage(name, function () {
    console.log('after sendMessage')
  })

  if (name === 'memes') {
    console.log('get list of memes')
    memes.returnAvailableMemes(req, function (message) {
      var reply = {
        'replyToMessageId': msg.id,
        'to': msg.from,
        'from': msg.to,
        'type': 'Message',
        'language': 'en',
        'text': message
      }
      res.send(reply)
    })
  } else {
    console.log('get one meme')
    memes.returnMeme(req, function (message, link) {
      if (!link) {
        res.send(message)
      }
      var reply = {
        'type': 'Message',
        'language': 'en',
        'text': '',
        'channelData':
        {
          'attachments': [
            {
              'title': message,
              'title_link': '',
              'text': '',
              'fields': [
                {
                  'title': '',
                  'value': '',
                  'short': false
                }
              ],

              'image_url': link,
              'thumb_url': link
            }
          ],
          'unfurl_links': false,
          'unfurl_media': false
        }
      }
      res.send(reply)
    })
  }
})

// Start server
server.listen(process.env.PORT || 5000, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Middleware to verfiy that requests are only coming from the Bot Connector Service
function verifyBotFramework (credentials) {
  return function (req, res, next) {
    console.log('verifyBotFramework')
    next()
  }
}

// Helper function to send a Bot originated message to the user.
function sendMessage (msg, cb) {
  console.log('sendMessage')
  var client = new Connector(credentials)
  console.log('after client is created')
  var options = {customHeaders: {'Ocp-Apim-Subscription-Key': credentials.password}}
  client.messages.sendMessage(msg, options, function (err, result, request, response) {
    if (!err && response && response.statusCode >= 400) {
      console.log(response.statusMessage)
      err = new Error('Message rejected with ' + response.statusMessage)
    }
    if (cb) {
      cb(err)
    }
  })
}
