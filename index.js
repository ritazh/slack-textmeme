var restify = require('restify');
var msRest = require('ms-rest');
var connector = require('botconnector');

// Initialize server
var server = restify.createServer();
server.use(restify.authorizationParser());
server.use(restify.bodyParser());

// Initialize credentials for connecting to Bot Connector Service
var appId = process.env.appId || 'your appId';
var appSecret = process.env.appSecret || 'your appSecret';
var credentials = new msRest.BasicAuthenticationCredentials(appId, appSecret);

// Handle incoming message
server.post('/meme', verifyBotFramework(credentials), function (req, res) {
	var msg = req.body;
	console.log("using new bot")
	console.log(msg)
    const [name] = req.body.text.split(';')

	if (name === 'memes') {
		return memes.returnAvailableMemes(req, res)
	} else {
	    return memes.returnMeme(req, res)
	}
});

// Start server
server.listen(process.env.PORT || 5000, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

// Middleware to verfiy that requests are only coming from the Bot Connector Service
function verifyBotFramework(credentials) {
    return function (req, res, next) {
        if (req.authorization && 
            req.authorization.basic && 
            req.authorization.basic.username == credentials.userName &&
            req.authorization.basic.password == credentials.password) 
        {
            next();        
        } else {
            res.send(403);
        }
    };
}

// Helper function to send a Bot originated message to the user. 
function sendMessage(msg, cb) {
    var client = new connector(credentials);
    var options = { customHeaders: {'Ocp-Apim-Subscription-Key': credentials.password}};
    client.messages.sendMessage(msg, options, function (err, result, request, response) {
        if (!err && response && response.statusCode >= 400) {
            err = new Error('Message rejected with "' + response.statusMessage + '"');
        }
        if (cb) {
            cb(err);
        }
    });          
}