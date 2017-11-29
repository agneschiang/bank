var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.displayphonenumber = function getPhoneData(session, PhoneNumber){
    var url = 'https://2017bankbot.azurewebsites.net/tables/BankBot';
    rest.getPhoneData(url, session, PhoneNumber, handlePhoneResponse)

};

function handlePhoneResponse(message, session, PhoneNumber) {
    var phoneResponse = JSON.parse(message);
    var phone = [];
    for (var index in phoneResponse) {
        var phoneRecieved = phoneResponse[index].PhoneNumber;
        console.log(phoneResponse[index]);
        var checkedAcc = phoneResponse[index].CheckedAccount;
        var savedAcc = phoneResponse[index].SavedAccount;
        var firstname = phoneResponse[index].fistname;
        var lastname = phoneResponse[index].lastname;

        if(PhoneNumber == phoneRecieved){
            if(phone.length -1){
                phone.push(checkedAcc);
                phone.push(savedAcc);
            }

            else{
        

                phone.push(checkedAcc);
                phone.push(savedAcc)
            }
            
        }
    
    }
    console.log(phoneResponse[index].PhoneNumber);
   
  if(PhoneNumber != phoneResponse[index].PhoneNumber ){
    session.send("You have given a wrong number, please type 'StartOver' ");
  }

  else{
    session.send("Here is your account detail: <br/>Checked Account: %s <br/> Saved Account: %s",  phone[0], phone[1]);

  }


}