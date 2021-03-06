HOME_PAGE = '/'
sequelize = require('sequelize')
Promise = sequelize.Promise

TAG_RECEIVED  = 1
TAG_ASSIGNED = 2
TAG_HANDLED = 3
TAG_AUDITED = 4
TAG_FINISHED = 5

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
    req.body.lastMail ?= 0
    req.body.tags = JSON.parse(req.body.tags) if typeof(req.body.tags) is "string"
    where = {
      id: (
        if req.body.oldMail
          $lt: req.body.oldMail
          $gt: req.body.lastMail
        else
          $gt: req.body.lastMail
      )
      status:
        switch user.privilege
          when 'auditor' then 'handled'
          else undefined
      dispatcherId:
        switch user.privilege
          when 'dispatcher' then $or:[
            null
          ,
            user.id
          ]
          else undefined
    }
    where = JSON.parse(JSON.stringify(where))
    Inbox.findAndCountAll(
      where: where
      include: [
        model: Tag
        where:
          if req.body.tags
            id: req.body.tags
          else
            undefined
      ,
        model: User
        as : 'assignees'
        where:
          if user.privilege is 'consumer'
            id : user.id
          else
            undefined
      ,
        model : User
        as : 'dispatcher'
      ]
      limit:
        req.body.limit
      order : [
        ['id','DESC']
      ]
    )
  .then (result)->
    res.json {
      status : 1
      msg : "Success"
      mails : result.rows
      count : result.count
    }

  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }


exports.postDetail = (req, res)->
  User = global.db.models.user
  Tag = global.db.models.tag
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    Inbox = global.db.models.inbox
    req.body.mail ?= null
    where = {
      id: req.body.mail
      status:
        switch user.privilege
          when 'auditor' then 'handled'
          else undefined
      dispatcherId:
        switch user.privilege
          when 'dispatcher' then $or:[
            null
          ,
            user.id
          ]
          else undefined
    }
    where = JSON.parse(JSON.stringify(where))
    Inbox.find(
      where: where
      include: [
        model: Tag
      ,
        model: User
        as : 'assignees'
        where:
          if user.privilege is 'consumer'
            id : user.id
          else
            undefined
      ,
        model : User
        as : 'dispatcher'
      ]
    )
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
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
  .then ->
    currentMail.setDispatcher(currentDispatcher)
  .then (mail)->
    mail.status = 'assigned'
    mail.save()
  .then (mail)->
    message = {
      title : "新任务"
      html : "<p>你被#{currentDispatcher.username}指派了任务#{mail.id}</p>"
      text : "你被#{currentDispatcher.username}指派了任务#{mail.id}"
      receivers : req.body.consumers
    }
    Promise.all([
      mail.addTags([TAG_ASSIGNED])
    ,
      mail.removeTags([TAG_RECEIVED])
    ,
      global.myUtil.message.send(message)
    ])
  .then ->
    res.json {
      status : 1
      msg : "Success"
    }
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postHandle = (req, res)->
  User = global.db.models.user
  Outbox = global.db.models.outbox
  currentConsumer = undefined
  currentReplyTo = undefined
  currentMail = undefined
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','consumer'])
    currentConsumer = user
    mail = Outbox.build req.body
    if req.body.urgent is '1'
      mail.status = 'audited'
    else
      mail.status = 'handled'
    currentMail = mail
    mail.getReplyTo()
  .then (replyTo)->
    return true if not replyTo
    currentReplyTo = replyTo
    replyTo.hasAssignee(currentConsumer)
  .then (exist)->
    throw new global.myError.InvalidAccess() if not exist
    throw new global.myError.Conflict() if currentReplyTo.status is 'handled'
    currentReplyTo.status = 'handled'
    message = {
      title : "任务得到了处理"
      html : "<p>你指派的任务，标题为#{currentReplyTo.title}得到了处理</p>"
      text : "你指派的任务，标题为#{currentReplyTo.title}得到了处理"
      receivers : [currentReplyTo.dispatcherId]
    }
    Promise.all([
      currentReplyTo.addTags([TAG_HANDLED])
    ,
      currentReplyTo.removeTags([TAG_ASSIGNED])
    ,
      global.myUtil.message.send(message)
    ])
    currentReplyTo.save()
  .then ->
    currentReplyTo.setConsumer(currentConsumer.id)
  .then ->
    currentMail.save()
  .then (mail)->
    mail.setConsumer(currentConsumer)
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
    req.body.tags = JSON.parse(req.body.tags) if typeof req.body.tags is 'string'
    currentMail.setTags(req.body.tags) if req.body.tags
  .then ->
    res.json {
      status : 1
      mail : currentMail
      msg : "Success"
    }
  .catch (err)->
    res.json {
      status : 0
      msg : err.message
    }

exports.postReturn = (req, res)->
  User = global.db.models.user
  Inbox = global.db.models.inbox
  currentUser = undefined
  currentMail = undefined
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
    currentMail = mail
    mail.setAssignees([])
  .then ->
    currentMail.status = 'received'
    currentMail.save()
  .then (mail)->
    res.json(
      status : 1
      msg : 'Success'
      mail : mail
    )
  .catch (err)->
    res.json(
      status : 0
      msg : err.message
    )

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
    mail.status = 'finished'
    mail.save()
  .then (mail)->
    mail.setConsumer(currentUser)
  .then (mail)->
    res.json(
      status : 1
      msg : 'Success'
      mail : mail
    )
  .catch (err)->
    res.json(
      status : 0
      msg : err.message
    )

exports.postTrans = (req, res)->
  User = global.db.models.user
  Inbox = global.db.models.inbox
  currentMail = undefined
  currentUser = undefined
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','consumer'])
    currentUser = user
    User.findById(req.body.assignee)
  .then (assignee)->
    throw new global.myError.UnknownUser() if not assignee
    throw new global.myError.InvalidAccess() if assignee.privilege isnt 'consumer'
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    currentMail = mail
    Promise.all([
      mail.removeAssignees(req.session.user.id)
    ,
      mail.addAssignees(req.body.assignee)
    ,
      global.myUtil.message.send(
        title : "新任务"
        html : "<p>你被#{currentUser.username}转发了，标题为#{mail.title}的任务</p>"
        text : "你被#{currentUser.username}转发了，标题为#{mail.title}的任务"
        receivers : [req.body.assignee]
        senderId: req.session.user.id
      )
    ])
  .then ->
    res.json(
      status : 1
      msg : "Success"
      mail : currentMail
    )
  .catch (err)->
    res.json(
      status : 0
      msg : err.message
    )

exports.postHurry = (req, res)->
  Inbox = global.db.models.inbox
  User = global.db.models.user
  currentDispatcher = undefined
  currentMail = undefined
  Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if not (user.privilege in ['admin','dispatcher'])
    currentDispatcher = user
    Inbox.findById(req.body.mail)
  .then (mail)->
    throw new global.myError.UnknownMail() if not mail
    throw new global.myError.InvalidAccess() if mail.status isnt 'assigned' or mail.dispatcherId isnt currentDispatcher.id
    currentMail = mail
    mail.getAssignees()
  .then (assignees)->
    message = {
      title : "赶紧处理你的邮件!"
      html : "<p>你被指派的任务邮件，标题为#{currentMail.title}请尽快处理</p>"
      text : "你被指派的任务邮件，标题为#{currentMail.title}请尽快处理"
      receivers : assignee.id for assignee in assignees
      senderId : currentDispatcher.id
    }
    global.myUtil.message.send(message)
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
