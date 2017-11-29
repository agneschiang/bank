var builder = require('botbuilder');
var balance = require('./Account');
var reserv = require('./Reservation');
var customVision = require('./CustomVision');
var location = require('./Map');
var currency = require('./currency');

exports.startDialog = function (bot) {
    
   
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/70cf5534-311f-483a-a5e4-87fe75ba1906?subscription-key=5d65b5a6c5b749548b818b417b32c9d6&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('OfficeHour', function (session, args) {
        if (!isAttachment(session)) {

            
            var timeEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'time');

           
            if (timeEntity) {
                session.send('Here is the opening hour <br /> Mon - Thur: 8:00AM - 5:00PM <br /> Fri: 8:00AM - 6:60PM <br /> Sat - Sun: Closed');
             

            } else {
                session.send("Sorry I don't quite understand! Please try again");
            }
        }
    }).triggerAction({
        matches: 'OfficeHour'
    });


    bot.dialog('Account', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["PhoneNumber"]) {
                builder.Prompts.text(session, "Enter a PhoneNumber ");       

            } else {
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["PhoneNumber"] = results.response;
                }

                session.send("Retrieving your Account");
                balance.displayphonenumber(session, session.conversationData["PhoneNumber"]); 
            }
            else{
                session.send("Don't quite get it, please try again")
        }
    }
    ]).triggerAction({
        matches: 'Account'
    });

    bot.dialog('Reservation', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["PhoneNumber"]) {
                builder.Prompts.text(session, "Enter a Phone number to setup your account.");                
            } else {
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["PhoneNumber"] = results.response;
                }
               
                var bookingEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'booking');
                var timeEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'bookingDate');
    
                
                if (bookingEntity && timeEntity) {
                    session.send('Your booking confirm: <br> Time: \%s\ <br/> Date: \%s\.' , bookingEntity.entity, timeEntity.entity);
                    reserv.sendReservation(session, session.conversationData["PhoneNumber"], bookingEntity.entity, timeEntity.entity); // <-- LINE WE WANT
    
                }else{
                    session.send("Don't quite get it, please try again")
            }
        }
    }
                    
        
    ]).triggerAction({
        matches: 'Reservation'
    });

    bot.dialog('DisplayBooking', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["PhoneNumber"]) {
                builder.Prompts.text(session, "Enter a Phone number to setup your account.");                
            } else {
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["PhoneNumber"] = results.response;
                }
                var checkingEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'check');
                var dateEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'bookingDate');

                if(checkingEntity && dateEntity){

                
                    session.send("Your booking on the \%s\ is... ", dateEntity.entity);
                    reserv.displayBooking(session, session.conversationData["PhoneNumber"], dateEntity.entity);
                }
                else{
                    session.send("Don't quite get it, please try again")
            }
            
        }
    }
    ]).triggerAction({
        matches:'DisplayBooking'

    });


    bot.dialog('DeleteBooking', [function (session, args, next) {
        
                    session.dialogData.args = args || {};
                    if (!session.conversationData["PhoneNumber"]) {
                        builder.Prompts.text(session, "Enter a Phone Number to setup your account.");
                    } else {
                        next(); // Skip if we already have this info.
                    }
                },
                function (session, results,next) {
                        if (!isAttachment(session)) {
                            if (results.response){
                                session.conversationData['PhoneNumber'] = results.response;
                            }
        
                            session.send("You want to delete your booking.");
        
                            // Pulls out the food entity from the session if it exists
                            var cancelEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'cancel');
                            var dateEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'bookingDate');
                            
        
                            // Checks if the for entity was found
                            if (cancelEntity && dateEntity) {
                                session.send('Deleting \'%s\'...', dateEntity.entity);
                                reserv.deleteBooking(session,session.conversationData['PhoneNumber'], dateEntity.entity); //<--- CALLL WE WANT
                            } 

                            else{
                                session.send("Don't quite get it, please try again")
                            }

                        }
        
            }
                // Insert delete logic here later
            ]).triggerAction({
                matches: 'DeleteBooking'
        
            });

    bot.dialog('Transaction', function (session, args) {
        if (!isAttachment(session)) {

            
            var transactionEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'transaction');

            
            if (transactionEntity) {
                session.send('Here is the instruction <br />');
           

            } else {
                session.send("Sorry I don't quite understand! Please try again");
            }
        }
    }).triggerAction({
        matches: 'Transaction'
    });

    

    bot.dialog('Location', function (session, args) {
        
                if (!isAttachment(session)) {
                    
                    var locationEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'place');
        
                   
                    if (locationEntity) {
                        session.send('Looking for %s detail...', locationEntity.entity);
                        location.displayAddress(locationEntity.entity, "auckland", session);
                    } else {
                        session.send("No food identified! Please try again");
                    }
               }
        
            }).triggerAction({
                matches: 'Location'
            });

    

    bot.dialog('Currency', [function(session, args) {
        if(!isAttachment(session)){
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'unit');

            if(currencyEntity){
                session.send('Looking for the currency %s', currencyEntity.entity);
                currency.displayCurrencyData(currencyEntity.entity, session);
            }
            else{
                session.send("No Category identified! Please try again");
            }
        }
    }
    
    ]).triggerAction({
        matches: 'Currency'
    });

    bot.dialog('WelcomeIntent', function (session, args){
       
        if(!isAttachment(session)){
            
                        
                        var welcomeEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'welcome');
            
                        
                        session.send("Welcome to this bot, you can do the following under this bot <br/> 1. Check your account <br/> 2. Check the office hour <br/> 3. Find the bank (e.g. Where is the bank) <br/>4. Make your booking (e.g. booking at 13 on the 16th) <br/> 5. Cancel your booking (e.g. cancel my booking on the 16th) <br/> 6. View Your booking (e.g. check my booking on the 16th) <br/> 7. Check the currency (e.g. currency for aud) <br/>8. Quit to start over");
                    }
    }).triggerAction({
        matches: 'WelcomeIntent'
    });


    bot.endConversationAction('Quit', 'Hope you enjoy our services :)', { matches: /^Quit/i });
    bot.endConversationAction('StartOver', 'Type the category that you want to start over',{ matches: /^StartOver/i });



function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        customVision.retreiveMessage(session);
        return true;
    }
    else {
        return false;
    }
    }

}