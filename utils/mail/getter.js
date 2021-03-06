var Listener = require('mail-listener2');
var dbhelper = require('./dbhelper');
var crypto = require('crypto');
var path = require('path');
var cheerio = require('cheerio');
var fs = require('fs');

var listener;
var attachment_dir = '/tmp';

function md5sum(str) {
	var sum = crypto.createHash('md5');
	sum.update(str);
	return sum.digest('hex');
}

exports.initConfig = function (mail) {
	attachment_dir = mail.attachmentsDir;

	listener = new Listener({
		username: mail.auth.mailaddr,
		password: mail.auth.password,
		host: mail.imap.host,
		port: mail.imap.port,
		tls: true,
		tlsOptions: {rejectUnauthorized: false},
		mailbox: 'INBOX',
		searchFilter: [ 'UNSEEN' ],
		markSeen: false,
		fetchUnreadOnStart: true,
		mailParserOptions: {streamAttachments: false},
		attachments: true,
		attachmentOptions: {directory: 'attachments/'}
	});

	listener.on("server:connected", function () {
		console.log("imap connected LMY Saaby!");
	});
	listener.on("server:disconnected", function () {
		console.log("imap disconnected");
	});
	listener.on("error", function (err) {
		console.log(err);
	});

	listener.on("mail", function (mail, seqno, attributes) {
		// get DOM of html content
		// var $ = cheerio.load(mail.html);
		console.log(mail);

        // process attachments
        if (!!mail.attachments) {
            for (var i = 0; i < mail.attachments.length; ++i) {
                var att = mail.attachments[i];
                if (att.fileName == 'ATT00001') {
                    // if this attachment is created by Exchange, just ignore it.
                    continue;
                }
                var name = md5sum(att.content.toString());

                // when saving file on server, we don't care about file extensions
                var of = fs.createWriteStream(path.join(attachment_dir, name));
                of.write(att.content);
                of.end(function() { console.log('save attachment done.'); });

                // change the references if needed
                // if (!!att.contentId) {
                //     var targets = $('[src="cid:'+att.contentId+'"]');
                //     targets.attr('src', '/attachments/'+name);
                // }
            }
        }
        
        // write the mail received into database
        // TODO: add support for attachments
        console.log('adding new mail to database');
        dbhelper(
            mail.subject || '',
            mail.from[0].name + '<' + mail.from[0].address + '>',
            mail.text || '',
            mail.html || ''	// should be $.html()
        );
    });


	// listener.on("attachment", function(attachment) {
	//     console.log(attachment);
	// });
};

exports.startMailGetter = function () {
	listener.start();
};