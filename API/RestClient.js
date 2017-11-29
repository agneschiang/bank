var request = require("request");

exports.getCurrencynData = function getData(url, session, currency, callback){
    
        request.get(url, function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body, currency, session);
            }
        });
    };

exports.getAccountData = function getData(url, session, username, password, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username, password);
        }
    });
};

exports.getPhoneData = function getData(url, session, PhoneNumber, callback){
    
        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body, session, PhoneNumber);
            }
        });
    };

exports.getBookingData = function getData(url, session, PhoneNumber, time, callback){
    
        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body, session, PhoneNumber, time);
            }
        });
    };
    

exports.postReservation = function sendData(url, PhoneNumber, date, time){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "PhoneNumber" : PhoneNumber,
            "date" : date,
            "time" : time
        }
      };


    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteBooking = function deleteData(url,session, PhoneNumber , time, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,PhoneNumber, time);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};

exports.getYelpData = function getData(url,bearer,session, callback){
    
        request.get(url,{'auth': { 'bearer': bearer}} ,function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body,session);
            }
        });
    };

exports.getCurrency = function getData(url, session, currency, callback){
    
        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err, res, body){

            if(err){
                console.log(err);
            }else {
                callback(body, session, currency);
            }
        });
    };