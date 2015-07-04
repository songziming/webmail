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
    console.log err
    res.redirect HOME_PAGE

exports.postAdd = (req, res)->
  Tag = global.db.models.tag
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    Tag.create(req.body)
  .then (tag)->
    res.json(
      status: 1
      msg : "Success"
      tag : tag
    )
  .catch sequelize.ValidationError, (err)->
    res.json(
      status : 0
      msg : err.message
    )
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE

exports.postDel = (req, res)->
  Tag = global.db.models.tag
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    Tag.destory(
      where:
        id : req.body.tags
    )
  .then ->
    res.json(
      status: 1
      msg : "Success"
    )
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE