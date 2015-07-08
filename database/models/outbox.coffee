module.exports = (sequelize, DataTypes) ->
  sequelize.define 'outbox', {
    title:
      type: DataTypes.TEXT
      allowNull: false
    text:
      type: DataTypes.TEXT('long')
      allowNull: false
    html:
      type: DataTypes.TEXT('long')
      allowNull: false
    tags:
      type: DataTypes.TEXT
    deadline:
      type: DataTypes.DATE
    accessoryPath:
      type: DataTypes.TEXT
    to:
      type: DataTypes.TEXT
    reason:
      type: DataTypes.TEXT('long')
#    consumerId:  #foreigh key
#      type: DataTypes.INTEGER
#    auditorId: #foreigh key
#      type: DataTypes.INTEGER
#    replyToId:
#      type: DataTypes.INTEGER
    status:
      type: DataTypes.ENUM("handled","audited","finished","failed","rejected")
      defaultValue : "handled"
      allowNull : false
  }