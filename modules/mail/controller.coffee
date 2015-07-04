HOME_PAGE = '/'
exports.postList = (req, res)->
  global.db.Promise.resolve()
    .then ->
      throw new global.myError.UnknownUser() if not req.session.user
      User = global.db.models.user
      User.findById(req.session.user.id)
    .then (user)->
      throw new global.myError.UnknownUser() if not user
      Inbox = global.db.models.inbox
      req.body.offset ?= 0
      req.body.limit ?= 20
      Inbox.findAndCountAll(
        where:
          switch user.privilege
              when 'admin' then undefined
              when 'consumer' then {
                status:'assigned'
                assignee:user.id
              }
              when 'dispatcher' then status:'received'
              when 'auditor' then status:'handled'
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
            assignee:user.id
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
    throw new global.myError.InvalidAccess() if not req.session.user

    User.findById(req.session.user.id)
  .then (dispatcher)->
    throw new global.myError.InvalidAccess() if not dispatcher
    throw new global.myError.InvalidAccess() if not (dispatcher.privilege in ['dispatcher','admin'])
    currentDispatcher = dispatcher
    User.findById(req.body.consumer)
  .then (consumer)->
    throw new global.myError.InvalidAccess() if not consumer
    throw new global.myError.InvalidAccess() if not (consumer.privilege in ['consumer','admin'])
    currentConsumer = consumer
    Inbox.findById(req.body.mail)
  .then (mail)->
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
  .catch global.myError.InvalidAccess, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect(HOME_PAGE)
