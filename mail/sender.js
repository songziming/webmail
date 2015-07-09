var mailer = require('nodemailer');
var dbhelper = require('./dbhelper');
var path = require('path');
var fs = require('fs');

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

/* To add attachments, first upload it to server, then:
 * mailOptions: {
 *     ....
 *     attachments: [
 *         {
 *             filename: 'sampletextfile.txt',
 *             content: fs.createReadStream('/path/to/file'),
 *             cid: 'lmysaaby'
 *         },
 *         ...
 *     ]   
 * }
 */

/*
<img src="cid:lmysaaby">
*/

var uefiles = require('../config').ueditor || '/uefiles';

exports.sendMail = function(to, subject, html, cb) {
    // before we actually send email, first find all occurance of local file.
    var p = new RegExp(uefiles+'/[0-9]+\\.[A-Za-z]+', 'g');
    var encoded = html.replace(p, function(s, i, all) {
        var fn = path.join(__dirname, '../static', s);
        var bf = fs.readFileSync(fn);
        var bs = bf.toString('base64');
        var src = 'data:image/';
        switch (path.extname(s).toLowerCase()) {
        case '.png':
            src += 'png';
            break;
        case '.gif':
            src += 'gif';
            break;
        default:
            src += 'jpeg';
            break;
        }
        src += ';base64,' + bs;
        return src;
    });

    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.html = encoded;
    console.log(mailOptions);
    transporter.sendMail(mailOptions, cb);
};

exports.replace = function(html) {
    var p = new RegExp(uefiles+'/[0-9]+\\.[A-Za-z]+', 'g');
    return html.replace(p, function(s, i, all) {
        var fn = path.join(__dirname, '../static', s);
        var bf = fs.readFileSync(fn);
        var bs = bf.toString('base64');
        var src = 'data:image/';
        switch (path.extname(s).toLowerCase()) {
            case '.png':
                src += 'png';
                break;
            case '.gif':
                src += 'gif';
                break;
            default:
                src += 'jpeg';
                break;
        }
        src += ';base64,' + bs;
        return src;
    });
};