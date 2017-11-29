var rest = require('../API/RestClient');
var builder = require('botbuilder');

exports.displayAddress = function getMapData(bank, region, session){
    var url = 'https://api.yelp.com/v3/businesses/search?term='+ bank +'&location=' + region + '&limit=5';
    var auth = 'BjSvhpAZ84uttmEOPzgkkUEo6HVIBwG_0aO00tZuQmuYfADZdoPPt3CY81ocUsWMbI8mG5DZsEu0hBD1-Ke2vn4JJQS3I9AWBnRIcTDi6g6mILuBseEVXYA16hEWWnYx';
    rest.getYelpData(url,auth,session,displayAddress);
}


function displayAddress(message, session) {
    var attachment = [];
    var locations = JSON.parse(message);
    
    //For each restaurant, add herocard with name, address, image and url in attachment
    for (var index in locations.businesses) {
        var place = locations.businesses[index];
        var name = place.name;
        var imageURL = place.image_url;
        var url = place.url;
        var address = place.location.address1 + ", " + place.location.city;

        var card = new builder.HeroCard(session)
            .title(name)
            .text(address)
            .images([
                builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, 'More Information')
            ]);
        attachment.push(card);

    }

    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}