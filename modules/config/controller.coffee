
exports.getDetail = (req, res)->
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    config = global.myConfig.mail
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

exports.postEdit = (req, res)->
  User = global.db.models.user
  global.db.Promise.resolve()
  .then ->
    User.findById(req.session.user.id) if req.session.user
  .then (user)->
    throw new global.myError.UnknownUser() if not user
    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin'
    config = global.myConfig.mail
    config.host = req.body.host if req.body.host
    config.port = req.body.port if req.body.port
    config.auth = req.body.auth if req.body.auth
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