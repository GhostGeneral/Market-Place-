let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let moment = require('moment');
let config = require('../config');
let models = require('../models');
let Mailer = require('../general/sendmail');
let generalFunctions = require('../general/funcs');
let GeneralController = require('../controllers/GeneralController');

let AuthController = {};
AuthController.ReturnModel = function(){
    return models.Setting;
}

//create Account
AuthController.Register = async function(req,res){

    
    
    if(!req.body.groupId){
        return res.json({success: false, message: 'Please provide group ID', responseType: 'invalid_group_id'});
    } else {
        var groupID = req.body.groupId;
        if(!req.body.email || !req.body.password){
            return res.json({success: false, message: 'Please provide a valid username and password', responseType:'invalid_credentials'});
        } else {
            var email = req.body.email;
            var password = req.body.password;

            //format phone number
          var mobilePhoneNo	 = awesomePhoneNo(req.body.mobilePhoneNo, 'NG').getNumber();

            models.Group.findById(groupID).then(function(group){
                if(group == null){
                    return res.json({success: false, message: 'The user group specified does not exist. Contact support team', responseType:'invalid_group'});
                } else {
                    if(group.alias == 'business'){
                        if(!req.body.businessName || !req.body.email){
                            return res.json({success: false, message: 'Please provide required business info',responseType:'incomplete_fields'})
                        }
                    }

                    //find the user by username
                    models.User.findOne({where: {email: email}}).then(async function(user){
                        if(user !== null){
                            return res.json({success: false, message: 'An account with similar credentials already exists', responseType:'account_exists'});
                        } else {
                            //create the new user account
                            var data = req.body;
                            var token = generalFunctions.createFourDigitsCode();
                            data['token'] = token;

                            //hash password
                            var hashedPassword = bcrypt.hashSync(password, 8);
                            data['password'] = hashedPassword;

                            //save formatted phone number
                            data['username'] = mobilePhoneNo;


                            models.User.create(data).then(async function(newUser){

                                //send email if its a business
                                if(group.alias == 'business'){

                                    if(data.email){
                                        var url = generalFunctions.getURL();
                                        var resetURL = url + 'account/verifytoken/' + token;

                                        var MailTemplateName = 'business_signup.html';
                                        var MailData = {
                                            name: data.businessName,
                                            email: data.email,
                                            token: token,
                                            resetURL: resetURL
                                        };
                                        var MailRecipient = data.email;
                                        var MailSubject = `Account verification - Market Place`;

                                        var sendMail = Mailer.sendTemplatedMail(MailTemplateName, MailData, MailRecipient, MailSubject);
                                    }

                                }

                                //send SMS token if its a customer
                                if(group.alias == 'customer'){
                                   
                                    if(data.email){
                                        let url = generalFunctions.getURL();
                                        let resetURL = url + 'account/verifytoken/' + token;
                                        let MailTemplateName ='customer_signup.html';
                                        let MailData = {
                                            name: data.firstName,
                                            email:data.email,
                                            token:token,
                                            resetURL:resetURL
                                        }
                                        var MailRecipient = data.email;
                                        var MailSubject = `Account verification - Market Place`;

                                        var sendMail = Mail.sendTemplatedMail(MailTemplateName,MailData,MailRecipient,MailSubject);
                                    }
                                }


                                return res.json({success: true, message: 'Your account was successfully created. Please check your email/SMS inbox for verification steps.', responseType:'successful'});
                            })
                        }
                    })
                }
            })
        }
    }
}

AuthController.Login = function(req,res){
    if(!req.body.email|| !req.body.password){
        return res.json({success:false, message: 'Please provide email and password', responseType:'incomplete_fields'});
    }
    var email = req.body.email;
    //check the email
    models.User.findOne({
        where: {email: email},
        include: [
            {model: models.Group}
        ]
    }).then(function(user){
        if(!user){
            return res.json({success: false, message: 'Sorry, we found no account that match the data provided', responseType:'invalid_user'})
        }

        //check if the password is valid
        var password = req.body.password;
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid){
            return res.json({ success: false, message:'Your email/password is not correct. Please try again', responseType: 'invalid_password'});
        }

        //check if the user is active
        if(!user.isActive){
            return res.json({success: false, message: 'Your account is inactive', responseType:'account_inactive'});
        }

        var userGroupAlias = user.Group.alias;

        //create token and send response
        // create a token
        var token = jwt.sign({ 
            id: user.id, 
            groupId: user.groupId,
            usergroupalias: userGroupAlias
         }, config.jwt.secret, {
            expiresIn: 604800 // expires in 7 days
        });
        

        user.token = token;

        //update user's last logged in data
        user.update({lastLoggedIn: moment()})

        return res.json({ success: true, message: "Authentication successful!", authToken: token, responseType:'successful', user: user });
    })
}



//forgot PIN or Password
AuthController.ForgotPassword = function(req, res){
    
    if(!req.body.username){
        return res.json({success: false, message: 'Please provide your phone number'});
    }
    
    var username = awesomePhoneNo(req.body.username, 'NG').getNumber();
    
    models.User.find({
        where:{
            username: username
        },
        include: [
            {
                model: models.Group
            }
        ]
    }).then(async function(user){
        if(!user) return res.json({success: false, message: 'User does not exist'});

        var usersGroup = user.Group.alias;

        if(usersGroup == 'customer'){
            var token = generalFunctions.createFourDigitsCode();
            var message = `You requested for a password reset on your EasyTruck247 profile. Your reset token is ${token}`;
            var sendMessage = await SendSMS.Send(username, message);
        } else {

            var token = generalFunctions.createActivationToken();
            //send mail
            var email = user.email;
            if(email){

                var url = generalFunctions.getURL();
                var resetURL = url + 'reset-password/' + token;

                var MailTemplateName = 'forgotpassword.html';
                var MailData = {
                    name: user.firstName + ' ' + user.lastName,
                    token: token,
                    resetURL: resetURL
                };
                var MailRecipient = email;
                var MailSubject = `Action required: Reset your password`;

                var sendMail = Mailer.sendTemplatedMail(MailTemplateName, MailData, MailRecipient, MailSubject);

            }
        }

        user.update({token: token, isActive: false}).then(function(){
            return res.json({success: true, message:'You will receive an SMS or Email which contains your password reset token.'})
        });
    })
}

// reset PIN or Password
AuthController.ResetPassword = function(req, res){
    if(!req.body.token || !req.body.password || !req.body.confirmPassword){
        return res.json({success: false, message: 'Please provide required fields'});
    }

    //if password is not equal to confirm password
    if(req.body.password !== req.body.confirmPassword){
        return res.json({success: false, message: 'Both passwords must match'});
    }

    //find the user with that token
    var token = req.body.token;
    models.User.find({
        where: {
            token: token
        }
    }).then(function(user){
        if(!user) return res.json({success: false, message: 'Found no account that match this token'});

        //hash the new password
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        user.update({isActive: true, password: hashedPassword, token: null}).then(function(){
            return res.json({success: true, message: 'Your password reset was successful'});
        })
    })
}

//activate account
AuthController.ActivateAccount = function(req, res){
    if(!req.params.token) return res.json({success: false, message: 'Please provide unique code'});

    var token = req.params.token;
    models.User.find({
        where: {
            token: token
        }
    }).then(user => {
        if(!user) return res.json({success: false, message: 'Found no account that match the details provided'});
        user.groupId
        user.update({token: null, isActive: true});
        if(user.groupId == 3 ){
        //send account activation mail
       // var notifyBusiness = Mailer.notifyBusinessOfAccountActivation(user);
        }else{

        // var notifyUser = Mailer.notifyBusinessOfAccountActivation(user);
        }
        return res.json({success: true, message: 'Congratulations! Your account verification was successful.'});
    }).catch(err => {
        return res.json({success: false, message: 'Failed to find related account'});
    })
}

//update my profile
AuthController.UpdateMyProfile = function(req, res){
    var userId = req.userId;
    models.User.findById(userId)
    .then(function(user){
        if(!user) return res.json({success: false, message: 'Found no user account that matched details provided'});

        var data = req.body;
        
        if(!data) return res.json({success: false, message: 'Please provide some data'});
        
        if(data.id){ delete data.id; }
        if(data.password){ data.password = bcrypt.hashSync(data.password, 8); }


        user.update(data);

        return res.json({success: true, message: 'Update successful'});
    }).catch(function(err){
        console.log(err);
        return res.json({success: false, message: 'Error occurred while attempting to update user info'});
    })
}
module.exports = AuthController;