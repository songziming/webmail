Promise = require('sequelize').Promise
mailer = require('nodemailer')
config = require('../config')
isStopped = false

TAG_RECEIVED  = 1
TAG_ASSIGNED = 2
TAG_HANDLED = 3
TAG_AUDITED = 4
TAG_FINISHED = 5

promiseWhile = (action, mailSender) ->
  resolver = Promise.defer()
  my_loop = ->
    return resolver.resolve() if isStopped
    Promise.cast(action(mailSender))
    .then(my_loop)
    .catch resolver.reject
  process.nextTick my_loop
  return resolver.promise

work = (mailSender)->
  currentMail = undefined
  global.db.models.outbox
  .find(
    where:
      status : 'audited'
  )
  .then (mail)->
    throw new global.myError.NoTask() if not mail
    currentMail = mail
    mailSender.sendMailPromised(
      to: mail.to
      from: "Saaby<#{config.mail.auth.mailaddr}>"
      subject: mail.title
      html : require('./sender').replace(mail.html)
    )

  .then ->
    currentMail.status = 'finished'
    currentMail.save()
  .then (mail)->
    mail.getReplyTo()
  .then (mail)->
    mail.status = "finished"
    message = {
      title : "任务完成"
      html : "<p>你指派的任务#{mail.title}已经完成了</p>"
      text : "你指派的任务#{mail.tile}已经完成了"
      receivers : [mail.dispatcherId]
    }
    Promise.all([
      mail.save()
    ,
      mail.addTags([TAG_FINISHED])
    ,
      mail.removeTags([TAG_HANDLED])
    ,
      global.myUtil.message.send(message)
    ])
  .catch global.myError.NoTask, ->
    Promise.delay(2000)
  .catch (err)->
    console.log err
    if currentMail
      currentMail.status = "failed"
      currentMail.reason += "#{new Date()}\n#{err.message}\n"
      currentMail.save()
      message = {
        title : "任务失败"
        html : "<p>你发送的标题为#{mail.tile}的邮件失败了</p>"
        text : "你发送的标题为#{mail.tile}的邮件失败了"
        receivers : [currentMail.consumerId]
      }
      global.myUtil.message.send(message)

module.exports = (config)->
  transporter = mailer.createTransport {
    host: config.smtp.host
    port: config.smtp.port
    secure: true
    auth:
      user: config.auth.mailaddr
      pass: config.auth.password
  }
  transporter = Promise.promisifyAll(transporter, {suffix:'Promised'});
  promiseWhile(work, transporter)