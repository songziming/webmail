mailer = require('nodemailer')
Promise = require('sequelize').Promise
exports.getDetail = (req, res)->
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    res.json(
      status : 1
      msg : "Success"
      config : global.myConfig.mail.auth
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )

exports.postEdit = (req, res)->
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    service = req.body.mailaddr.split('@')
    switch service[service.length-1]
      when 'buaa.edu.cn' then service = 'buaa'
      when 'qq.com' then service = 'qq'
      when '163.com' then service = '163'
      else throw new Error("Unknown email-address")

    service = global.myConfig.mail[service]
    service.auth = {
      mailaddr: req.body.mailaddr
      username: req.body.username
      password: req.body.password
    }

    global.myMail.stopGettingMail();
    global.myMail.initMailConfig(service);
    global.myMail.startGettingMail();

    config = service
    transporter = mailer.createTransport {
      host: config.smtp.host
      port: config.smtp.port
      secure: true
      auth:
        user: config.auth.mailaddr
        pass: config.auth.password
    }
    global.transporter = Promise.promisifyAll(transporter, {suffix:'Promised'});
    res.json(
      status : 1
      msg : "Success"
      config : config
    )
  .catch (err)->
    res.json(
      status: 0
      msg: err.message
    )