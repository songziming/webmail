Promise = require('sequelize').Promise

exports.send = (data)->
  Message = global.db.models.message
  form = {
    title : data.title
    html : data.html
    text : data.text
  }
  Message.create(form)
  .then (message)->
    global.db.Promise.all([
      message.setSender(data.senderId)
    ,
      message.setReceivers(data.receivers)
    ])
