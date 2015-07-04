var Listener = require('mail-listener2');
var dbhelper = require('./dbhelper');

var listener;

exports.initConfig = function(mail) {
    listener = new Listener({
        username: mail.auth.mailaddr,
        password: mail.auth.password,
        host: mail.imap.host,
        port: mail.imap.port,
        tls: true,
        tlsOptions: {rejectUnauthorized: false},
        mailbox: 'INBOX',
        searchFilter: ['UNSEEN'],
        markSeen: true,
        fetchUnreadOnStart: true,
        mailParserOptions: {streamAttachments: true},
        attachments: true,
        attachmentOptions: {directory: 'attachments/'}
    });

    listener.on("server:connected", function() {
        console.log("imap connected LMY Saaby!");
    });
    listener.on("server:disconnected", function() {
        console.log("imap disconnected");
    });
    listener.on("error", function(err) {
        console.log(err);
    });

    listener.on("mail", function(mail, seqno, attributes) {
        // console.log(mail);
        // write the mail received into database
        console.log('adding new mail to database');
        dbhelper(
            mail.subject || '',
            mail.from[0].name + '<' + mail.from[0].address + '>',
            mail.text || '',
            mail.html || ''
        );
    });

    listener.on("attachment", function(attachment) {
        console.log(attachment);
    });
};

exports.startMailGetter = function() {
    listener.start();
};