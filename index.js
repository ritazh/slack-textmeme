'use strict'

var restify = require('restify');
var msRest = require('ms-rest');
var connector = require('botconnector');

// Initialize server
var server = restify.createServer();
server.use(restify.authorizationParser());
server.use(restify.bodyParser());

// Initialize credentials for connecting to Bot Connector Service
var appId = process.env.appId || 'textmeme';
var appSecret = process.env.appSecret || 'ec470402ed6d4f2c9e40e597bc4cff73';
var credentials = null; //new msRest.BasicAuthenticationCredentials(appId, appSecret);

// Handle incoming message
server.post('/v1/messages', verifyBotFramework(credentials), function (req, res) {
    var msg = req.body;
    if (/^delay/i.test(msg.text)) {
        // Delay sending the reply for 5 seconds
        setTimeout(function () {
            var reply = { 
                replyToMessageId: msg.id,
                to: msg.from,
                from: msg.to,
                text: 'I heard "' + msg.text.substring(6) + '"'
            };
            sendMessage(reply);
        }, 5000);
        res.send({ text: 'ok... sending reply in 5 seconds.' })
    } else {
        res.send({ text: 'I heard "' + msg.text + '". Say "delay {msg}" to send with a 5 second delay.' })
    }
});

// Start server
server.listen(process.env.PORT || 5000, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

// Middleware to verfiy that requests are only coming from the Bot Connector Service
function verifyBotFramework(credentials) {
    return function (req, res, next) {
    	console.log('verifyBotFramework')
    	next()
    	/*
        if (req.authorization && 
            req.authorization.basic && 
            req.authorization.basic.username == credentials.userName &&
            req.authorization.basic.password == credentials.password) 
        {
            next();        
        } else {
            res.send(403);
        }
        */
    };
}

// Helper function to send a Bot originated message to the user. 
function sendMessage(msg, cb) {
	console.log('sendMessage')
    var client = new connector(credentials);
    var options = { };//customHeaders: {'Ocp-Apim-Subscription-Key': credentials.password}};
    client.messages.sendMessage(msg, options, function (err, result, request, response) {
        if (!err && response && response.statusCode >= 400) {
            err = new Error('Message rejected with "' + response.statusMessage + '"');
        }
        if (cb) {
            cb(err);
        }
    });          
}