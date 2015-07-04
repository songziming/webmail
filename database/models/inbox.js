// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(sequelize, DataTypes) {
    return sequelize.define('inbox', {
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      html: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      tags: {
        type: DataTypes.TEXT
      },
      deadline: {
        type: DataTypes.DATE
      },
      accessoryPath: {
        type: DataTypes.TEXT
      },
      from: {
        type: DataTypes.TEXT
      },
      consumerId: {
        type: DataTypes.INTEGER
      },
      dispatcherId: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.ENUM("received", "assigned", "handled", "finished"),
        "default": "received",
        allowNull: false
      }
    });
  };

}).call(this);

//# sourceMappingURL=inbox.js.map
