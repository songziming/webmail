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
      assignee: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.ENUM("received", "assigned", "finished"),
        "default": "received"
      }
    });
  };

}).call(this);

//# sourceMappingURL=inbox.js.map
