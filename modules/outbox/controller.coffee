sequelize = require('sequelize')
HOME_PAGE = '/'
exports.postList = (req, res)->
  global.db.Promise.resolve()
  .then ->
    User = global.db.models.user
    if req.session.user
      User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    #throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    Outbox = global.db.models.outbox
    Inbox = global.db.models.inbox
    req.body.offset ?= 0
    req.body.limit ?= 20
    req.body.lastMail ?= 0
    Outbox.findAndCountAll(
      where:
        switch user.privilege
          when 'admin' then {
            id :(
              if req.body.oldMail
                $lt: req.body.oldMail
                $gt: req.body.lastMail
              else
                $gt: req.body.lastMail
            )
          }
          when 'auditor' then {
            id :(
              if req.body.oldMail
                $lt: req.body.oldMail
                $gt: req.body.lastMail
              else
                $gt: req.body.lastMail
            )
            auditorId :
              $or : [null, user.id]
          }
          when 'consumer' then {
            id :(
              if req.body.oldMail
                $lt: req.body.oldMail
                $gt: req.body.lastMail
              else
                $gt: req.body.lastMail
            )
            consumerId :
              $or : [null, user.id]
          }
          else {
            id : null
          }
      include : [
        model: Inbox
        as: 'replyTo'
      ]
      limit : req.body.limit
      order : [
        ['id','DESC']
      ]
    )
  .then (result)->
    res.json(
      status : 1
      msg : 'Success'
      mails : result.rows
      count : result.count
    )
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }


exports.postDetail = (req, res)->
  global.db.Promise.resolve()
  .then ->
    User = global.db.models.user
    if req.session.user
      User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    #throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    Outbox = global.db.models.outbox
    req.body.mail ?= null
    Inbox = global.db.models.inbox
    Outbox.find(
      where:
        switch user.privilege
          when 'admin' then {
            id : req.body.mail
          }
          when 'auditor' then {
            id : req.body.mail
            auditorId :
              $or : [null, user.id]
          }
          when 'consumer' then {
            id : req.body.mail
            consumerId :
              $or : [null, user.id]
          }
          when 'dispatcher' then {
            id : null
          }
      include : [
        model: Inbox
        as: 'replyTo'
      ]
    )
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    res.json(
      status : 1
      msg : 'Success'
      mail : mail
    )
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postAudit = (req, res)->
  currentMail = undefined
  currentUser = undefined
  global.db.Promise.resolve()
  .then ->
    User = global.db.models.user
    if req.session.user
      User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    currentUser = user
    Outbox = global.db.models.outbox
    Outbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.status isnt 'handled' and mail.status isnt 'rejected'
    switch req.body.result #判断之后发件箱的件应该是什么状态
      when '1' then mail.status = 'audited'
      when '0' then mail.status = 'rejected'
    mail.reason ?= ""
    mail.reason += req.body.reason
    mail.auditor = req.session.id
    mail.save()
  .then (mail)->
    message = {}
    currentMail = mail
    if req.body.result is '1'
      message = {
        title : "审核通过"
        html : "<p>您的邮件#{mail.title}被审核<b>通过</b>了，现已加入发送队列</p>"
        text : "您的邮件#{mail.title}被审核**通过**了，现已加入发送队列"
        senderId : 1
        receivers : [currentMail.consumerId]
      }
    else
      message = {
        title : "审核未通过"
        html : "<p>您的邮件#{mail.title}审核<b>未通过</b>原因是:#{req.body.reason}</p>"
        text : "您的邮件#{mail.title}审核**未通过**,原因是:#{req.body.reason}"
        senderId : 1
        receivers : [currentMail.consumerId]
      }
    global.myUtil.message.send(message)
  .then ->
    res.json(
      status : 1
      mail : currentMail
      msg : 'Success'
    )
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postHandle = (req, res)->
  User = global.db.models.user
  Outbox = global.db.models.outbox
  currentConsumer = undefined
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','consumer'])
    currentConsumer = user
    Outbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.consumerId isnt currentConsumer.id
    throw new global.myError.InvalidAccess() if mail.status isnt 'rejected'
    mail.status = 'handled'
    mail.title = req.body.title if req.body.title
    mail.auditorId = req.body.auditorId if req.body.auditorId
    mail.html = req.body.html if req.body.html
    mail.text = req.body.text if req.body.text
    mail.to =req.body.to if req.body.to
    mail.save()
  .then (mail)->
    res.json {
      status : 1
      msg : "Success"
      mail : mail
    }
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postEdit = (req, res)->
  User = global.db.models.user
  Outbox = global.db.models.outbox
  currentAuditor = undefined
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','auditor'])
    currentAuditor = user
    Outbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.auditorId isnt currentAuditor.id
    throw new global.myError.InvalidAccess() if mail.status isnt 'handled'
    mail.title = req.body.title if req.body.title
    mail.html = req.body.html if req.body.html
    mail.text = req.body.text if req.body.text
    mail.to =req.body.to if req.body.to
    mail.save()
  .then (mail)->
    res.json {
      status : 1
      msg : "Success"
      mail : mail
    }
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }