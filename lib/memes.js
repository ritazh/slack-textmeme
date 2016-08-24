'use strict'

const fetch = require('node-fetch')
const url = require('url')

const Meme = class Meme {
  constructor () {
    // Cache available memes
    this.memeUrl = url.format({ pathname: 'http://memegen.link/templates' })
    this.getAvailableMemes()
  }

  /**
   * Returns available memes, either cached or directly
   * from memegen
   *
   * @returns {object} - Memes
   */
  getAvailableMemes () {
    return new Promise((resolve, reject) => {
      if (this.availableMemes) {
        resolve(this.availableMemes)
      } else {
        return fetch(this.memeUrl)
          .then((response) => response.json())
          .then((json) => {
            this.availableMemes = json
            resolve(json)
          })
          .catch((error) => console.log({error}))
      }
    })
  }

  /**
   * Returns all the memems MemeGen is capable of
   * parsing.
   *
   * @param req {object} - Express request object
   * @param res {object} - Express response object
   */
  returnAvailableMemes (req, msg, res) {
    return this.getAvailableMemes()
      .then((availableMemes) => {
        let memes = ''

        for (var key in this.availableMemes) {
          memes += `\`${key}\`\n\n`
        }

        var reply = {
          'replyToMessageId': msg.id,
          'to': msg.from,
          'from': msg.to,
          'type': 'Message',
          'language': 'en',
          'text': memes
        }

        res.send(reply)
      })
  }

  /**
   * Returns a created meme image, using MemeGen
   *
   * @param req {object} - Express request object
   * @param res {object} - Express response object
   */
  returnMeme (req, res) {
    return this.getAvailableMemes()
      .then((availableMemes) => {
        const [name, topText, bottomText] = req.body.text.split(';')
        let memeRequestUrl
        let message
        let link = null
        let reply

        if (topText === undefined || topText === null || bottomText === undefined || bottomText === null) {
          message = 'Hmmm...seems you forgot to provide the top and bottom text for your meme. Try again! Example usage: doge; This BOT is; AWESOME;'
          reply = {
            'type': 'Message',
            'language': 'en',
            'text': '',
            'channelData':
            {
              'attachments': [
                {
                  'title': message,
                  'title_link': '',
                  'text': 'Hi There',
                  'fields': [
                    {
                      'title': '',
                      'value': '',
                      'short': false
                    }
                  ]                }
              ],
              'unfurl_links': false,
              'unfurl_media': false
            }
          }
          res.send(reply)
        }

        for (var key in availableMemes) {
          if (key.toUpperCase() === name.toUpperCase()) {
            memeRequestUrl = `${availableMemes[key]}/${topText}/${bottomText}`
            break
          }
        }

        if (memeRequestUrl) {
          // We found a meme, let's respond to it
          return fetch(memeRequestUrl)
            .then((memeResponse) => memeResponse.json())
            .then((meme) => {
              let memeLink = meme.direct.visible
              console.log(memeLink)
              message = `${topText} ${bottomText}`
              link = memeLink

              reply = {
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
        } else {
          // We didn't find a meme, let's respond with an error
          message = 'Hmmm...seems we cannot find the meme ${name}. Try another meme!'
          reply = {
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
        }
      })
  }
}

module.exports = Meme
