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
    req.body.offset ?= 0
    req.body.limit ?= 20
    Outbox.findAndCountAll(
      where:
        switch user.privilege
          when 'admin' then undefined
          when 'auditor' then {
            auditorId :
              $or : [null, user.id]
          }
          when 'consumer' then {
            consumerId :
              $or : [null, user.id]
          }
          when 'dispatcher' then {
            id : null
          }
      offset: req.body.offset
      limit : req.body.limit
    )
  .then (result)->
    res.json(
      status : 1
      msg : 'Success'
      mails : result.rows
      count : result.count
    )
  .catch global.myError.UnknownUser, (err)->
    res.json(
      status : 0
      msg : err.message
    )
  .catch (err)->
    console.log err
    res.redirect(HOME_PAGE)


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
    )
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    res.json(
      status : 1
      msg : 'Success'
      mail : mail
    )
  .catch global.myError.UnknownUser,global.myError.UnknownMail, (err)->
    res.json(
      status : 0
      msg : err.message
    )
  .catch (err)->
    console.log err
    res.redirect(HOME_PAGE)

exports.postAudit = (req, res)->
  currentMail = undefined
  global.db.Promise.resolve()
  .then ->
    User = global.db.models.user
    if req.session.user
      User.findById(req.session.user.id)
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    Outbox = global.db.models.outbox
    Outbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.status isnt 'handled'
    switch req.body.result #判断之后发件箱的件应该是什么状态
      when '1' then mail.status = 'audited'
      when '0' then mail.status = 'failed'
    mail.reason ?= ""
    mail.reason += req.body.reason
    mail.auditor = req.session.id
    mail.save()
  .then (mail)->
    currentMail = mail
    mail.getReplyTo()
  .then (replyTo)->
    #throw new global.myError.UnknownMail() if not replyTo
    return undefined if not replyTo
    throw new global.myError.InvalidAccess() if replyTo.status isnt 'handled'
    if req.body.result is '0' #如果被拒绝了，原来的邮件应该变为被分配，重新进行处理
      replyTo.status = 'assigned'
      replyTo.save()
  .then ->
    res.json(
      status : 1
      mail : currentMail
      msg : 'Success'
    )
  .catch global.myError.InvalidAccess, global.myError.UnknownUser, global.myError.UnknownMail, (err)->
    res.json(
      status : 0
      msg : err.message
    )
  .catch (err)->
    console.log err
    res.redirect(HOME_PAGE)