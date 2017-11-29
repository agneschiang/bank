var rest = require('../API/Restclient');

exports.sendReservation = function postReservation(session, PhoneNumber, date, time){
    var url = 'https://2017bankbot.azurewebsites.net/tables/BankBot';
    rest.postReservation(url, PhoneNumber, date, time)
};

exports.displayBooking = function getBookingData(session, PhoneNumber, time){
    var url = 'https://2017bankbot.azurewebsites.net/tables/BankBot';
    rest.getBookingData(url, session, PhoneNumber, time,  handleBookingResponse)
    
};

exports.deleteBooking = function deleteBooking(session,PhoneNumber,time){
    var url  = 'https://2017bankbot.azurewebsites.net/tables/BankBot';


    rest.getBookingData(url, session, PhoneNumber, time, function(message,session, PhoneNumber, time){
     var   Booking = JSON.parse(message);

        for(var i in Booking) {

            if (Booking[i].time === time && Booking[i].PhoneNumber === PhoneNumber) {


                rest.deleteBooking(url,session,PhoneNumber,time, Booking[i].id ,handleDeletedBookingResponse)

            }
        }


    });


};

function handleBookingResponse(message, session, PhoneNumber, time) {
    var BookingResponse = JSON.parse(message);
    var booking = [];
    for (var index in BookingResponse) {
        var phoneNumberReceived = BookingResponse[index].PhoneNumber;
        var timeRecieved = BookingResponse[index].time; //date --> 16th//
        console.log(BookingResponse[index]);
        var bookingDate = BookingResponse[index].date; //time ==> 9:00//

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (PhoneNumber == phoneNumberReceived && time == timeRecieved) { // date are the same//
            //Add a comma after all favourite foods unless last one
            if (bookingDate != null){
                if(booking.length - 1) {
                    booking.push(bookingDate);
                }
                else {
                    booking.push(bookingDate);
                }
            
            } 

            session.send("Your booking is at %s", booking); 
            }
        
        }
    
    if(PhoneNumber != BookingResponse[index].PhoneNumber){
        session.send("You have typed a wrong number, please type 'startover' to start again");
    }

    if(PhoneNumber == BookingResponse[index].PhoneNumber && time != BookingResponse[index].time){
        session.send("You don't have any booking on that day");
    }

    
    

}

function handleDeletedBookingResponse(body, session, PhoneNumber, time){
    
        console.log('Done');
    
           
    }