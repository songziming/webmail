HOME_PAGE = '/'
sequelize = require('sequelize')

exports.getAll = (req, res)->
  Tag = global.db.models.tag
  Tag.findAll()
  .then (tags)->
    res.json(
      status : 1
      msg : "Success"
      tags : tags
    )
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postAdd = (req, res)->
  Tag = global.db.models.tag
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','dispatcher'])
    Tag.create(req.body)
  .then (tag)->
    res.json(
      status: 1
      msg : "Success"
      tag : tag
    )
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postDel = (req, res)->
  Tag = global.db.models.tag
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','dispatcher'])
    if typeof(req.body.tags) is "string"
      req.body.tags = JSON.parse(req.body.tags)
    Tag.destroy(
      where:
        id : req.body.tags
    )
  .then ->
    res.json(
      status: 1
      msg : "Success"
    )
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }