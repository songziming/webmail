module.exports = (sequelize, DataTypes) ->
  sequelize.define 'mailTag', {
    inboxId:
      type: DataTypes.INTEGER
      unique : "mail-tag"
    tagId:
      type: DataTypes.INTEGER
      unique : "mail-tag"
  }