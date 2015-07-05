HOME_PAGE = '/'
sequelize = require('sequelize')
exports.postList = (req, res)->
  Tag = global.db.models.tag
  User = global.db.models.user
  global.db.Promise.resolve()
    .then ->
      User.findById(req.session.user.id) if req.session.user
    .then (user)->
      throw new global.myError.UnknownUser() if not user
      Inbox = global.db.models.inbox
      req.body.offset ?= 0
      req.body.limit ?= 20
      if typeof(req.body.tags) is "string"
        req.body.tags = JSON.parse(req.body.tags)
      Inbox.findAndCountAll(
        where:
          switch user.privilege
              when 'admin' then undefined
              when 'consumer' then {
                consumerId:user.id
              }
              when 'dispatcher' then {
                  $or:[
                    status:'received',
                    dispatcherId : user.id
                  ]
              }
              when 'auditor' then status:'handled'
        include:
          if req.body.tags
            model : Tag
            where :
              id : req.body.tags
          else
            undefined
        offset:
          req.body.offset
        limit:
          req.body.limit
      )
    .then (result)->
      res.json {
        status : 1
        msg : "Success"
        mails : result.rows
        count : result.count
      }

    .catch global.myError.UnknownUser, (err)->
      res.json {
        status : 0
        msg : err.message
      }
    .catch (err)->
      console.log err
      res.redirect HOME_PAGE


exports.postDetail = (req, res)->
  global.db.Promise.resolve()
  .then ->
    throw new global.myError.UnknownUser() if not req.session.user
    User = global.db.models.user
    User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    Inbox = global.db.models.inbox
    req.body.mail ?= null
    Inbox.find(
      where:
        switch user.privilege
          when 'admin' then {
            id : req.body.mail
          }
          when 'consumer' then {
            id : req.body.mail
            status:'assigned'
            consumerId:user.id
          }
          when 'dispatcher' then {
            id : req.body.mail
            status:'received'
          }
          when 'auditor' then {
            id : req.body.mail
            status:'handled'
          }
    )
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    res.json {
      status : 1
      msg : "Success"
      mail : mail
    }

  .catch global.myError.UnknownUser, global.myError.UnknownMail, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE

exports.postDispatch = (req, res)->
  User = global.db.models.user
  Inbox = global.db.models.inbox
  currentConsumer = undefined
  currentDispatcher = undefined
  global.db.Promise.resolve()
  .then ->
    throw new global.myError.UnknownUser() if not req.session.user

    User.findById(req.session.user.id)
  .then (dispatcher)->
    throw new global.myError.UnknownUser() if not dispatcher
    throw new global.myError.InvalidAccess() if not (dispatcher.privilege in ['dispatcher','admin'])
    currentDispatcher = dispatcher
    User.findById(req.body.consumer)
  .then (consumer)->
    throw new global.myError.UnknownUser() if not consumer
    throw new global.myError.InvalidAccess() if not (consumer.privilege in ['consumer','admin'])
    currentConsumer = consumer
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    mail.setConsumer(currentConsumer)
  .then (mail)->
    mail.setDispatcher(currentDispatcher)
  .then (mail)->
    mail.status = 'assigned'
    mail.save()
  .then ->
    res.json {
      status : 1
      msg : "Success"
    }
  .catch global.myError.InvalidAccess, global.myError.UnknownUser,global.myError.UnknownMail, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect(HOME_PAGE)

exports.postHandle = (req, res)->
  User = global.db.models.user
  Outbox = global.db.models.outbox
  currentConsumer = undefined
  global.db.Promise.resolve()
  .then ->
    throw new global.myError.UnknownUser() if not req.session.user
    User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','consumer'])
    Outbox.build req.body
  .then (mail)->
    if req.body.urgent is '1'
      mail.status = 'audited'
    else
      mail.status = 'handled'
    mail.save()
  .then (mail)->
    mail.setConsumer(currentConsumer)
    mail.getReplyTo()
  .then (replyTo)->
    throw new global.myError.InvalidAccess() if replyTo.status isnt 'assigned'
    replyTo.status = 'handled'
    replyTo.save()
  .then ->
    res.json {
      status : 1
      msg : "Success"
    }
  .catch global.myError.UnknownUser, global.myError.InvalidAccess, sequelize.ValidationError, sequelize.ForeignKeyConstraintError, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE

exports.postUpdate = (req, res)->
  User = global.db.models.user
  Inbox = global.db.models.inbox
  currentMail = undefined
  global.db.Promise.resolve()
  .then ->
    throw new global.myError.UnknownUser() if not req.session.user
    User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','dispatcher'])
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    mail.deadline = new Date(req.body.deadline) if req.body.deadline
    mail.save()
  .then (mail)->
    currentMail = mail
    return undefined if not req.body.tags
    #req.body.tags = JSON.parse(req.body.tags)
    currentMail.setTags(req.body.tags) if req.body.tags
  .then ->
    res.json {
      status : 1
      mail : currentMail
      msg : "Success"
    }
  .catch global.myError.UnknownUser, global.myError.UnknownMail, global.myError.InvalidAccess, sequelize.ValidationError, sequelize.ForeignKeyConstraintError, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE

exports.postReturn = (req, res)->
  User = global.db.models.user
  Inbox = global.db.models.inbox
  currentUser = undefined
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege not in ['admin', 'consumer']
    currentUser = user
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.status isnt 'assigned'
    throw new global.myError.InvalidAccess() if mail.consumerId isnt currentUser.id and currentUser.privilege is 'consumer'
    mail.status = 'received'
    mail.consumerId = null
    mail.save()
  .then (mail)->
    res.json(
      status : 1
      msg : 'Success'
      mail : mail
    )
  .catch global.myError.InvalidAccess, global.myError.UnknownMail, global.myError.UnknownUser, (err)->
    res.json(
      status : 0
      msg : err.message
    )
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE

exports.postFinish = (req, res)->
  User = global.db.models.user
  Inbox = global.db.models.inbox
  currentUser = undefined
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege not in ['admin', 'consumer']
    currentUser = user
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.status isnt 'assigned'
    throw new global.myError.InvalidAccess() if mail.consumerId isnt currentUser.id and currentUser.privilege is 'consumer'
    mail.status = 'finished'
    mail.save()
  .then (mail)->
    res.json(
      status : 1
      msg : 'Success'
      mail : mail
    )
  .catch global.myError.InvalidAccess, global.myError.UnknownMail, global.myError.UnknownUser, (err)->
    res.json(
      status : 0
      msg : err.message
    )
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE
