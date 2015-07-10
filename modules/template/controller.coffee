Promise = require('sequelize').Promise
exports.postCreate = (req, res)->
  User = global.db.models.user
  Template = global.db.models.template
  Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    Template.create(
      name: req.body.name
      html: req.body.html
      text: req.body.text
    )
  .then (template)->
    res.json(
      status: 1
      msg: "Success"
      template: template
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )

exports.getList = (req, res)->
  Template = global.db.models.template
  Template.findAll()
  .then (templates)->
    res.json(
      status: 1
      msg: "Success"
      templates: templates
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )

exports.postUpdate = (req, res)->
  Template = global.db.models.template
  User = global.db.models.user
  Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt "admin"
    Template.findById(req.body.template)
  .then (template)->
    throw new global.myError.UnknownTemplate() if not template
    template.name = req.body.name if req.body.name
    template.html = req.body.html if req.body.html
    template.text = req.body.text if req.body.text
    template.save()
  .then (template)->
    res.json(
      status: 1
      msg : "Success"
      template: template
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )

exports.postDelete = (req, res)->
  Template = global.db.models.template
  User = global.db.models.user
  Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt "admin"
    Template.destroy(
      where:
        id : req.body.template
    )
  .then ->
    res.json(
      status: 1
      msg : "Success"
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )