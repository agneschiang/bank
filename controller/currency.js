var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.displayCurrencyData = function getData(currency, session){
    var url = "http://www.apilayer.net/api/live?access_key=cb9ffcc6b2cdefca06e2fe407556b0d6&currencies=" + currency;
    rest.getCurrency(url, session, currency, handleCurrencyResponse);
}

function handleCurrencyResponse(message, session, currency){
    var attachment = [];
    var currencies = JSON.parse(message);
    
    for (var index in currencies.quotes){
        var unit = currencies.quotes[index];
        console.log(" ");
        console.log(currencies[index]);
        console.log(unit);
        console.log(" ");
        if (currencies.length -1){
            attachment.push(unit);
        }
        else{
            attachment.push(unit + ",");
        }

        //var card = new builder.HeroCard(session)
        //.title('USD')
        //.text(currencyRecieved)
    //attachment.push(card);


    }
    //var message = new builder.Message(session)
    //.attachmentLayout(builder.AttachmentLayout.carousel)
    //.attachments(attachment);
    console.log(" ");
    console.log(currencies.quotes);
    console.log(" ");
    console.log(attachment);
    console.log("");

    session.send("Here is your currency %s from usd to %s", attachment, currency);
}