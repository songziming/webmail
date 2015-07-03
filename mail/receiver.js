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