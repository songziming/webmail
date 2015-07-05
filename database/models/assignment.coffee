module.exports = (sequelize, DataTypes) ->
  sequelize.define 'assignment', {
    assignee:
      type: DataTypes.INTEGER
      unique : "assignment"
    target:
      type: DataTypes.INTEGER
      unique : "assignment"
  }