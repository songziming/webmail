module.exports = (sequelize, DataTypes) ->
  sequelize.define 'template', {
    name:
      type : DataTypes.STRING
      unique: true
    text:
      type : DataTypes.TEXT('long')
      allowNull : false
      validate:
        notEmpty: true
    html:
      type : DataTypes.TEXT('long')
      allowNull : false
      validate:
        notEmpty: true
  }