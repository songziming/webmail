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
      tmp = undefined
      if req.body.tags
        tmp ?= []
        tmp.push {
          model: Tag
          where:
            id: req.body.tags
        }
      if user.privilege is 'consumer'
        tmp ?= []
        tmp.push {
          model: User
          as : 'assignees'
          where:
            id : user.id
        }
      Inbox.findAndCountAll(
        where:
          switch user.privilege
              when 'admin' then undefined
              when 'dispatcher' then {
                  $or:[
                    status:'received'
                  ,
                    dispatcherId : user.id
                  ]
              }
              when 'auditor' then status:'handled'
        include: tmp
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
  currentMail = undefined
  currentDispatcher = undefined
  global.db.Promise.resolve()
  .then ->
    throw new global.myError.UnknownUser() if not req.session.user
    User.findById(req.session.user.id)
  .then (dispatcher)->
    throw new global.myError.UnknownUser() if not dispatcher
    throw new global.myError.InvalidAccess() if not (dispatcher.privilege in ['dispatcher','admin'])
    currentDispatcher = dispatcher
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    currentMail = mail
    req.body.consumers = JSON.parse(req.body.consumers) if typeof req.body.consumers is 'string'
    mail.setAssignees(req.body.consumers)
  .then (mail)->
    currentMail.setDispatcher(currentDispatcher)
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
  currentReplyTo = undefined
  @sequelize.transaction()
  .then (t)->
    global.db.Promise.resolve()
    .then ->
      User.findById(req.session.user.id, transaction : t) if req.session.user
    .then (user)->
      throw new global.myError.UnknownUser() if not user
      throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','consumer'])
      currentConsumer = user
      mail = Outbox.build req.body
      if req.body.urgent is '1'
        mail.status = 'audited'
      else
        mail.status = 'handled'
      mail.save(transaction : t)
    .then (mail)->
      mail.setConsumer(currentConsumer, transaction : t)
    .then (mail)->
      mail.getReplyTo(transaction : t)
    .then (replyTo)->
      return if not replyTo
      currentReplyTo = replyTo
      replyTo.hasAssignee(currentConsumer, transaction : t)
    .then (exist)->
      throw new global.myError.InvalidAccess() if not exist
      throw new global.myError.Conflict() if currentReplyTo.status is 'handled'
      currentReplyTo.status = 'handled'
      currentReplyTo.save(transaction : t)
    .then (replyTo)->
      currentReplyTo.setConsumer(currentConsumer.id, transaction : t)
    .then ->
      t.commit()
    .then ->
      res.json {
        status : 1
        msg : "Success"
      }
    .catch global.myError.Conflict, global.myError.UnknownUser, global.myError.InvalidAccess, sequelize.ValidationError, sequelize.ForeignKeyConstraintError, (err)->
      t.rollback()
      res.json {
        status : 0
        msg : err.message
      }
    .catch (err)->
      t.rollback()
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
