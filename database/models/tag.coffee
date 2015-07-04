module.exports = (sequelize, DataTypes) ->
  sequelize.define 'tag', {
    content:
      type : DataTypes.STRING
      allowNull : false
      unique: true
      validate:
        notEmpty: true
  }