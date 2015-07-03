var getter = require('./getter');
var sender = require('./sender');

exports.initMailConfig = function(mail) {
    getter.initConfig(mail);
    sender.initConfig(mail);
}

exports.startGettingMail = function() {
    getter.startMailGetter();
};

exports.sendMail = function(to, subject, html) {
    sender.sendMail(to, subject, html);
};