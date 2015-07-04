var getter = require('./getter');

exports.initMailConfig = function(mail) {
    getter.initConfig(mail);
};

exports.startGettingMail = function() {
    getter.startMailGetter();
};

exports.startSender = require('./sendmaild');
