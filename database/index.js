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

    Inbox.belongsTo(User, {
        as : 'assignee',
        foreignKey : 'assigneeId'
    });

    Inbox.belongsTo(User, {
        as : 'dispatcher',
        foreignKey : 'dispatcherId'
    });

    return sequelize;
};