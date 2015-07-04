/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
var Sequelize, models, path;

Sequelize = require('sequelize');

path = require('path');

models = require('./models');

module.exports = function(database, username, password, config) {
    sequelize = new Sequelize(database, username, password, config);

    sequelize.import(path.join(__dirname, 'models/user'));
    sequelize.import(path.join(__dirname, 'models/inbox'));

    return sequelize;
};