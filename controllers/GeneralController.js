var models = require('../models');
var moment = require('moment');
var crypto = require('crypto');
var rp = require('request-promise');
var btoa = require('btoa');
var Base64 = require('js-base64').Base64;

var encryptionHelper = require('../general/simpleEncryption');
var encAlgorithm = encryptionHelper.CIPHERS.AES_256;
var encPassword = "123lmnoPq490abcdefg5678hiJkrstuv";
var encNonce = crypto.randomBytes(16);



var General = {};



//get status by alias
General.GetStatusByAlias = function(alias = null, theModel){
    var status = theModel.Status.findOne({where: {alias: alias}}).then(function(status){
        return status;
    }).catch(function(err){
        return false;
    });

    return status;
}

General.RandomAlphaNumeric = function(){
    return Math.random().toString(36).substr(6);
}



General.hexToBase64 = function(str) {
    return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}










module.exports = General;