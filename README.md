# Slack Text Meme with Microsoft Bot Framework
[![Build Status](https://travis-ci.org/ritazh/slack-textmeme.svg?branch=master)](https://travis-ci.org/ritazh/slack-textmeme)

_A Slackbot that creates a meme with text_.

![Slack Text Meme Demo](botdemo.gif)

This Slackbot creates a meme with text overlay using [memegen](http://memegen.link).

## Installation

Clone this repo and then install dependencies:

    git clone https://github.com/ritazh/slack-textmeme.git
    cd slack-textmeme
    git checkout botframework
    npm install

Push directly to Azure Web App:
    The botframework branch on github has been setup to push directly to an Azure web app


Setup Slack bot:
* Follow the instructions on [Bot Framework website](https://dev.botframework.com/bots) to setup a Slack Channel.

## Usage

In Slack, after adding the textmeme bot user to a channel, you can start with:

    memes
    doge; This BOT is; AWESOME;


## License
Licensed using the MIT License (MIT); Copyright (c) Microsoft Corporation. For more information, please see [LICENSE](LICENSE).
