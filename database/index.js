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
    var Message = sequelize.import(path.join(__dirname, 'models/message'));
    var MessageRelation = sequelize.import(path.join(__dirname, 'models/message-relation'));
    var Template = sequelize.import(path.join(__dirname, 'models/template'));
    Inbox.belongsTo(User, {
        as : 'consumer'
    });

    Inbox.belongsTo(User, {
        as : 'dispatcher'
    });

    Outbox.belongsTo(User, {
        as : 'consumer'
    });

    Outbox.belongsTo(User, {
        as : 'auditor'
    });

    Outbox.belongsTo(Inbox, {
        as : 'replyTo'
    });


    Inbox.belongsToMany(Tag, {
        through: {
            model: mailTag
        }
    });
    Tag.belongsToMany(Inbox, {
        through: {
            model: mailTag
        }
    });

    User.belongsToMany(Inbox, {
        as : 'targets',
        through: {
            model: assignment
        }
    });

    Inbox.belongsToMany(User, {
        as: 'assignees',
        through: {
            model: assignment
        }
    });

    Message.belongsTo(User, {
        as: 'sender'
    });

    Message.belongsToMany(User, {
        as: 'receivers',
        through: {
            model: MessageRelation
        }
    });

    User.belongsToMany(Message, {
        through: {
            model: MessageRelation
        }
    });
    return sequelize;
};