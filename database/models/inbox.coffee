module.exports = (sequelize, DataTypes) ->
  sequelize.define 'inbox', {
    title:
      type: DataTypes.STRING
      allowNull: false
    sourcePath:
      type: DataTypes.STRING
      allowNull: false
    tags:
      type: DataTypes.TEXT
    deadline:
      type: DataTypes.DATE
    accessoryPath:
      type: DataTypes.STRING
    from:
      type: DataTypes.TEXT
    assignee:  #foreigh key
      type: DataTypes.INTEGER
    status:
      type: DataTypes.ENUM("received","assigned","finished")
  }