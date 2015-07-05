/**
 * Created by Ã÷Ñô on 2015/6/29.
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
    var Tag = sequelize.import(path.join(__dirname, 'models/tag'));
    var mailTag = sequelize.import(path.join(__dirname, 'models/mail-tag'));
    var assignment = sequelize.import(path.join(__dirname, 'models/assignment'));

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


    Inbox.belongsToMany(Tag, {
        through: {
            model: mailTag
        },
        foreignKey: 'inboxId'
    });
    Tag.belongsToMany(Inbox, {
        through: {
            model: mailTag
        },
        foreignKey: 'tagId'
    });

    User.belongsToMany(Inbox, {
        through: {
            model: assignment
        },
        foreignKey: 'assignee'
    });

    Inbox.belongsToMany(User, {
        through: {
            model: assignment
        },
        foreignKey: 'target'
    });
    return sequelize;
};