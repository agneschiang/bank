var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');

// Some sections have been omitted

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
 

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "d455d919-02c7-44d1-9fb4-40c61157eae9",
    appPassword: "txhVE2|ykdwYZMAQ3585~_?"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. try again with the the category below <br/> 1. Check your account <br/> 2. Check the office hour <br/> 3. Find the bank (e.g. Where is the bank) <br/>4. Make your booking (e.g. booking at 13 on the 16th) <br/> 5. Cancel your booking (e.g. cancel my booking on the 16th) <br/> 6. View Your booking (e.g. check my booking on the 16th) <br/> 7. Check the currency (e.g. currency for aud) <br/>8. Quit to start over', session.message.text);
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);
 