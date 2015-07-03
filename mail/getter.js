var Listener = require('mail-listener2');

var listener = new Listener({
    username: "398588697@qq.com",
    password: "s19z26m13",
    host: "imap.qq.com",
    port: 993,
    tls: true,
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "INBOX",
    searchFilter: ["UNSEEN"],
    markSeen: true,
    fetechUnreadOnStart: true,
    mailParserOptions: {streamAttachments: true},
    attachments: true,
    attachmentOptions: {directory: "attachments/"}
});

listener.on("server:connected", function() {
    console.log("imap connected");
});

listener.on("server:disconnected", function() {
    console.log("imap disconnected");
});

listener.on("error", function(err) {
    console.log(err);
});

listener.on("mail", function(mail, seqno, attributes) {
    console.log(mail);
});

listener.on("attachment", function(attachment) {
    console.log(attachment);
});

exports.startMailGetter = function() {
    listener.start();
};