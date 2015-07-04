var getter = require('./getter');
var sender = require('./sender');

exports.initMailConfig = function(mail) {
    getter.initConfig(mail);
    sender.initConfig(mail);
}

exports.startGettingMail = function() {
    getter.startMailGetter();
};

exports.startSender = require('./sendmaild');
/* Example callback:
function(err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log('Message sent: ' + info.response);
    }
}
 */

exports.sendMail = function(to, subject, html, cb) {
    sender.sendMail(to, subject, html, cb);
};