module.exports = (sequelize, DataTypes) ->
  sequelize.define 'inbox', {
    title:
      type: DataTypes.TEXT
      allowNull: false
    content:
      type: DataTypes.TEXT
      allowNull: false
    tags:
      type: DataTypes.TEXT
    deadline:
      type: DataTypes.DATE
    accessoryPath:
      type: DataTypes.TEXT
    from:
      type: DataTypes.TEXT
    assignee:  #foreigh key
      type: DataTypes.INTEGER
    status:
      type: DataTypes.ENUM("received","assigned","finished")
  }