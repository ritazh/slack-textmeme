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
  returnAvailableMemes (req, res) {
    return this.getAvailableMemes()
      .then((availableMemes) => {
        let text = ''

        for (var key in this.availableMemes) {
          text += `\`${key}\`\n`
        }

        res.send({text})
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

        if (topText === undefined || topText === null || bottomText === undefined || bottomText === null) {
          res.send({ text: 'Hmmm...seems you forgot to provide the top and bottom text for your meme. Try again! Example usage: /textmeme doge; This BOT is; AWESOME;' })
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

              res.send({
                'response_type': 'in_channel',
                'attachments': [
                  {
                    'title': `${topText} ${bottomText}`,
                    'image_url': memeLink
                  }
                ]
              })
            })
        } else {
          // We didn't find a meme, let's respond with an error
          res.send({ text: `Hmmm...seems we cannot find the meme ${name}. Try another meme!` })
        }
      })
  }
}

module.exports = Meme
