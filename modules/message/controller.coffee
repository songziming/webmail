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
      sender: user.id
      receivers: req.body.receivers
    )
  .then (result)->
    console.log result
    res.json(
      status: 1
      msg: "Success"
    )
  .catch global.myError.UnknownUser, sequelize.ValidationError, (err)->
    res.json(
      status: 0
      msg: err.message
    )
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE
