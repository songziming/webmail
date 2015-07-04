module.exports = (sequelize, DataTypes) ->
  sequelize.define 'inbox', {
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
    from:
      type: DataTypes.TEXT
    assigneeId:  #foreigh key
      type: DataTypes.INTEGER
    dispatcherId: #foreigh key
      type: DataTypes.INTEGER
    status:
      type: DataTypes.ENUM("received","assigned","handled","finished")
      default : "received"
      allowNull : false
  }