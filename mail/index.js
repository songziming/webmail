var Listener = require('mail-listener2');
var fs = require('fs');
var mailer = require('nodemailer');

var listener = new Listener({
    username: '12211010@buaa.edu.cn',
    password: 's19z26m13',
    host: 'mail.buaa.edu.cn',
    // host: 'imap.163.com',
    // host: 'imap.qq.com',
    port: 993,
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

// exception and error handling
listener.on('server:connected', function() {
    console.log('mail server connection established');
});
listener.on('server:disconnected', function() {
    console.log('mail server connection lost');
});
listener.on('error', function(err) {
    console.log(err);
});

var fmt = function(saaby) {
    return saaby.name + '<' + saaby.address + '>';
};

var fmtarr = function(arr) {
    if (arr == undefined) {
        return 'None';
    }
    return arr.map(fmt).join(', ');
};

// when new mail received
listener.on('mail', function(mail, seqno, attrib) {
    console.log('seqno  ' + seqno);
    console.log('attrib ' + attrib);
    console.log('FROM: ' + fmt(mail.from[0]));
    console.log('TO:   ' + mail.to.map(fmt).join(', '));
    console.log('CC:   ' + mail.cc && fmtarr(mail.cc));
    console.log('BCC:  ' + mail.bcc && fmtarr(mail.bcc));
    console.log(mail.cc);
    console.log(mail.bcc);
    console.log('====================');
    console.log('SUBJECT:  ' + mail.subject);
    console.log('DATE:     ' + mail.date);
    console.log('PRIORITY: ' + mail.priority);
    console.log('TEXT:     ' + mail.text);
    console.log('HTML:     ' + mail.html);
});

// when mail attachment received
listener.on('attachment', function(attachment, mail) {
    console.log('got attachment', attachment.path);
    var output = fs.createWriteStream(attachment.generatedFileName);
    attachment.stream.pipe(output);
});

// start listening
// listener.start();

var transporter = mailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: 's.ziming@hotmail.com',
        pass: 's19z26m13'
    }
});

var mailOptions = {
    'from': 'Song Ziming <s.ziming@hotmail.com>',
    'to': '12211010@buaa.edu.cn',
    'subject': 'Mail sent by node-mailer',
    'html': '<h1>Title Level One</h1><p>We only supply html content.</p>'
};

transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log('Message sent: ' + info.response);
    }
});
