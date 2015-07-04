Promise = require('sequelize').Promise
mailer = require('nodemailer')
isStopped = false
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
      from: "<12211010@buaa.edu.cn>"
      subject: mail.title
      html : mail.html
    )

  .then (info)->
    currentMail.status = 'finished'
    currentMail.save()
  .catch global.myError.NoTask, (err)->
    Promise.delay(2000)
  .catch (err)->
    console.log err
    if currentMail
      currentMail.status = "failed"
      currentMail.save()

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