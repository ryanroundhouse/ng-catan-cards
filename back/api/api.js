var nodemailer = require('nodemailer');
var nodeMailInfo = require('../nodemailInfo');

var transporter = nodemailer.createTransport(nodeMailInfo.nodeMailInfo);

exports.sendEmail = function(emailInfo){
    console.log("sending email...");
    console.log(nodeMailInfo.nodeMailInfo);
    transporter.sendMail(emailInfo, function(error, info){
        if (error){
            console.log(error);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
    })
    console.log(emailInfo);
}