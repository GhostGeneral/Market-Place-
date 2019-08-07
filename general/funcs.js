var env = process.env.NODE_ENV || "development";
var crypto = require('crypto');
var config = require('../config');

var GeneralFunctions = {};

GeneralFunctions.createActivationToken = function(){
    const secret = config.jwt.secret;
    var date = new Date();
    var dateNow = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

    const hash = crypto.createHmac('sha256', secret).update(dateNow).digest('hex');
    return hash
}

GeneralFunctions.createFourDigitsCode = function(){
    var code = Math.floor(1000 + Math.random() * 9000);
    return code;
}

GeneralFunctions.getURL = function(){
    if(env == "development"){
        return "http://localhost:8080/";
    } else {
        return "https://google.com/";
    }
}




module.exports = GeneralFunctions;