var nodemailer = require('nodemailer');

var nodeMailInfo;
try{
    const nodeMailEmail = process.env.DECK_DEALER_EMAIL;
    const nodeMailKey = process.env.DECK_DEALER_KEY;
    const nodeMailService = process.env.DECK_DEALER_SERVICE;
    if (nodeMailEmail){
        nodeMailInfo = {
            nodeMailInfo: {
                service: nodeMailService,
                auth: {
                user: nodeMailEmail,
                pass: nodeMailKey,
                }
            }
        };
    }
    else{
        nodeMailInfo = require('../nodemailInfo');
    }
}catch (exception){
    if (exception.code === 'MODULE_NOT_FOUND'){
        console.log('no nodeMailInfo found.  You have to manually create this with your own SMTP data.  See nodemailInfo-sample.js for a sample of how to do so.');
    }
}

var transporter = nodemailer.createTransport(nodeMailInfo.nodeMailInfo);

var mailThreads = [];

exports.sendEmail = function(emailInfo){
    console.log("sending email...");
    let existingMessageId;
    if (mailThreads.length > 0){
        existingMessageId = mailThreads.find(thread => thread.email === emailInfo.to).messageId;
        console.log(`existing messageId found: re-using ${existingMessageId}`);
        if (existingMessageId){
            emailInfo.messageId = existingMessageId;
        }
    }
    emailInfo.attachments.forEach(attachment => {
        const att = __dirname + "/../../" + attachment.path;
        console.log(`correcting path from ${attachment.path} to ${att}`);
        attachment.path = att;
    });
    console.log(nodeMailInfo.nodeMailInfo);
    transporter.sendMail(emailInfo, function(error, info, response){
        console.log(`error: ${JSON.stringify(error)}`);
        console.log(`info: ${JSON.stringify(info)}`);
        console.log(`response: ${JSON.stringify(response)}`);
        if (error === null){
            console.log('Email sent: ' + info.response);
            if (!existingMessageId){
                mailThreads.push({email: emailInfo.to, messageId: info.messageId});
                console.log(`mailThreads: ${JSON.stringify(mailThreads)}`);
            }
        }
    })
    console.log(emailInfo);
}