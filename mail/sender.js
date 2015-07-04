var mailer = require('nodemailer');
var dbhelper = require('./dbhelper');

var transporter;
var mailOptions;

exports.initConfig = function(mail) {
    transporter = mailer.createTransport({
        host: mail.smtp.host,
        port: mail.smtp.port,
        secure: true,
        auth: {
            user: mail.auth.mailaddr,
            pass: mail.auth.password
        }
    });
    mailOptions = {
        'from': mail.auth.username + '<' + mail.auth.mailaddr + '>',
        'to': 'somebody',
        'subject': 'some title',
        'html': 'some html'
    };
};

exports.sendMail = function(to, subject, html) {
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.html = html;
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};