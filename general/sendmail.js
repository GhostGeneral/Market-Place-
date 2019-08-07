var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
var generalFunctions = require('./funcs');
var DEFAULT_EMAIL_SENDER = process.env.DEFAULT_EMAIL_SENDER;
var SMTP_USERNAME = process.env.SMTP_USERNAME;
var SMTP_PASSWORD = process.env.SMTP_PASSWORD;
var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

var MailController = {};

var env = process.env.NODE_ENV || "development";

var smtpConfig = {
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
    }
};

var transporter = nodemailer.createTransport(smtpConfig);


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};


MailController.sendTemplatedMail = function(templateName = null,data = {},recipient = null, subject = null){


    readHTMLFile('public/emailtemplates/header.html', function(err, headerHtml){
        var header = headerHtml;

        readHTMLFile('public/emailtemplates/footer.html', function(err, footerHtml){
            var footer = footerHtml;

            readHTMLFile(`public/emailtemplates/${templateName}`, function(err, html) {
                var template = handlebars.compile(header + html + footer);
                var replacements = data;
                var htmlToSend = template(replacements);

                var mailOptions = {
                    from: `Market Place <${DEFAULT_EMAIL_SENDER}>`,
                    to : recipient,
                    subject : subject,
                    html : htmlToSend
                };

                //NEW WAY VIA SENDGRID
                sgMail.send(mailOptions).then(function(d){
                    console.log("MAIL SENDING SUCCESSFUL", d);
                    return true;
                }).catch(function(err){
                    console.log("MAIL SENDING FAILED", err);
                    return false;
                });


                //OLD WAY OF SENDING VIA AWS SES
                /*
                 transporter.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log("Error occurred:", error);
                        return error;
                    } else {
                        console.log("Response received: ", response);
                        return response;
                    }
                });*/


            });
        });
    });

}



module.exports = MailController;