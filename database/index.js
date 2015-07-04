/**
 * Created by ���� on 2015/6/29.
 */
var Sequelize, models, path;

Sequelize = require('sequelize');

path = require('path');

models = require('./models');

module.exports = function(database, username, password, config) {
    sequelize = new Sequelize(database, username, password, config);

    var User = sequelize.import(path.join(__dirname, 'models/user'));
    var Inbox = sequelize.import(path.join(__dirname, 'models/inbox'));
    var Outbox = sequelize.import(path.join(__dirname, 'models/outbox'));

    Inbox.belongsTo(User, {
        as : 'consumer',
        foreignKey : 'consumerId'
    });

    Inbox.belongsTo(User, {
        as : 'dispatcher',
        foreignKey : 'dispatcherId'
    });

    Outbox.belongsTo(User, {
        as : 'consumer',
        foreignKey : 'consumerId'
    });

    Outbox.belongsTo(User, {
        as : 'auditor',
        foreignKey : 'auditorId'
    });

    Outbox.belongsTo(Inbox, {
        as : 'replyTo',
        foreignKey : 'replyToId'
    });

    User.hasMany(Outbox, {
        as : 'auditorMail',
        foreignKey: 'auditorId'
    });

    User.hasMany(Outbox, {
        as: 'comsumerMail',
        foreignKey: 'consumerId'
    });

    return sequelize;
};