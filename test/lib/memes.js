/* global describe it */
'use strict'

const Memes = require('../../lib/memes')
const memes = new Memes()

describe('Memes', () => {
  describe('returnAvailableMemes()', () => {
    it('should return a list of available memes', () => {
      const res = {
        send (data) {
          this.sentData = data
        }
      }

      return memes.returnAvailableMemes(null, res)
        .then(() => {
          res.sentData.text.should.contain('One Does Not Simply Walk into Mordor')
          res.sentData.text.should.contain('Futurama Fry')
          res.sentData.text.should.contain('Captain Hindsight')
        })
    })
  })

  describe('returnMeme()', () => {
    it('should return a list of available memes', () => {
      const res = {
        send (data) {
          this.sentData = data
        }
      }
      const req = {
        body: {
          text: 'Futurama Fry;I am;a test'
        }
      }

      return memes.returnMeme(req, res)
        .then(() => {
          res.sentData.should.be.ok
          res.sentData.should.have.ownProperty('attachments')
          res.sentData.attachments.should.have.ownProperty('length')
          res.sentData.attachments[0].should.be.ok
          res.sentData.attachments[0].should.have.ownProperty('image_url')
        })
    })
  })
})
