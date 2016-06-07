'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const Memes = require('./lib/memes')
const memes = new Memes()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', (process.env.PORT || 9001))

// HTTP GET endpoint, simply showing that
// express is alive and well
app.get('/', function (req, res) {
  res.send('It works!')
})

// HTTP POST endpoint for the Slack bot
app.post('/meme', (req, res) => {
  const [name] = req.body.text.split(';')

  if (name === 'memes') {
    return memes.returnAvailableMemes(req, res)
  } else {
    return memes.returnMeme(req, res)
  }
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
