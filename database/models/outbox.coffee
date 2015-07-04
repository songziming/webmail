module.exports = (sequelize, DataTypes) ->
  sequelize.define 'outbox', {
    title:
      type: DataTypes.TEXT
      allowNull: false
    text:
      type: DataTypes.TEXT
      allowNull: false
    html:
      type: DataTypes.TEXT
      allowNull: false
    tags:
      type: DataTypes.TEXT
    deadline:
      type: DataTypes.DATE
    accessoryPath:
      type: DataTypes.TEXT
    to:
      type: DataTypes.TEXT
    consumerId:  #foreigh key
      type: DataTypes.INTEGER
    auditorId: #foreigh key
      type: DataTypes.INTEGER
    replyToId:
      type: DataTypes.INTEGER
    status:
      type: DataTypes.ENUM("handled","audited","finished")
      default : "handled"
      allowNull : false
  }