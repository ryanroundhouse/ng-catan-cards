var nodemailer = require('nodemailer');
try{
    var nodeMailInfo = require('../nodemailInfo');
}catch (exception){
    if (exception.code === 'MODULE_NOT_FOUND'){
        console.log('no nodeMailInfo found.  You have to manually create this with your own SMTP data.  See nodemailInfo-sample.js for a sample of how to do so.');
    }
}

var transporter = nodemailer.createTransport(nodeMailInfo.nodeMailInfo);

exports.sendEmail = function(emailInfo){
    console.log("sending email...");
    console.log(emailInfo.attachments[0].path);
    emailInfo.attachments[0].path = __dirname + "/../../" + emailInfo.attachments[0].path;
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