HOME_PAGE = '/'
sequelize = require('sequelize')
Promise = require('sequelize').Promise

exports.postSend = (req, res)->
  User = global.db.models.user
  Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    Util = global.myUtil
    req.body.receivers = JSON.parse(req.body.receivers) if typeof req.body.receivers is 'string'
    Util.message.send(
      title: req.body.title
      html: req.body.html
      text: req.body.text
      senderId: user.id
      receivers: req.body.receivers
    )
  .then (result)->
    res.json(
      status: 1
      msg: "Success"
      message: result[0]
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )

exports.postReceive = (req, res)->
  Message = global.db.models.message
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    req.body.lastMessage ?= 0
    Message.findAll(
      id: (
        if req.body.oldMessage
          $gt: req.body.lastMessage
          $lt: req.body.oldMessage
        else
          $gt: req.body.lastMessage
      )
      status: 'unread'
      include: [
        model: User
        as: 'receivers'
        where:
          id : user.id
      ]
    )
  .then (messages)->
    res.json(
      status: 1
      msg : "Success"
      messages: messages
    )
  .catch (err)->
    res.json(
      status: 0
      msg : err.message
    )

exports.postSent = (req, res)->
  Message = global.db.models.message
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    req.body.lastMessage ?= 0
    Message.findAll(
      id:(
        if req.body.oldMessage
          $gt: req.body.lastMessage
          $lt: req.body.oldMessage
        else
          $gt: req.body.lastMessage
      )
      include: [
        model: User
        as: 'sender'
        where:
          id : user.id
      ,
        model: User
        as: 'receivers'
      ]
    )
  .then (messages)->
    res.json(
      status: 1
      msg : "Success"
      messages: messages
    )
  .catch (err)->
    res.json(
      status: 0
      msg : err.message
    )

exports.postRead = (req, res)->
  Message = global.db.models.message
  User = global.db.models.user
  req.body.messages = JSON.parse(req.body.messages) if typeof req.body.messages is 'string'
  Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    user.getMessages(
      where:
        id : req.body.messages
    )
  .then (messages)->
    Message.update(
      status: 'read'
    ,
      where:
        id: (message.id for message in messages)
    )
  .then ->
    res.json(
      status: 1
      msg : "Success"
    )
  .catch (err)->
    res.json(
      status: 0
      msg : err.message
    )
