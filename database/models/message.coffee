module.exports = (sequelize, DataTypes) ->
  sequelize.define 'message', {
    title:
      type: DataTypes.TEXT
      allowNull: false
    text:
      type: DataTypes.TEXT('long')
      allowNull: false
    html:
      type: DataTypes.TEXT('long')
      allowNull: false
    status:
      type: DataTypes.ENUM("unread","read")
      defaultValue : "unread"
      allowNull : false
  }