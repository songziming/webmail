HOME_PAGE = '/'
passwordHash = require('password-hash')
exports.postLogin = (req, res) ->

  form = {
    username: req.body.username
    password: req.body.password
  }
  #precheckForLogin(form)
  User = global.db.models.user

  User.find {
    where:
      username: form.username
  }
  .then (user)->
    throw new global.myError.LoginError() if not user #没有找到该用户
    throw new global.myError.LoginError() if not passwordHash.verify(form.password, user.password) #判断密码是否正确
    req.session.user = {
      username : user.username
      id : user.id
      privilege : user.privilege
    }
    res.json {
      status : 1
      msg : "success"
    }
  .catch global.myError.LoginError, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE


exports.getLogout = (req, res)->
  delete req.session.user
  res.json {
    status : 1
    msg : "success"
  }

exports.postLogout = (req, res)->
  delete req.session.user
  res.json {
    status : 1
    msg : "success"
  }

exports.getAll = (req, res)->
  global.db.Promise.resolve()
  .then ->
#    throw new global.myError.InvalidAccess() if not req.session.user
#    User = global.db.models.user
#    User.findById(req.session.user.id)
#  .then (user)->
#    throw new global.myError.InvalidAccess() if user.privilege isnt 'admin' #检查权限
    User = global.db.models.user
    User.findAll()
  .then (users)->
    res.json {
      status : 1
      users : users
    }
  .catch global.myError.InvalidAccess, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE

exports.getInfo = (req, res)->
  global.db.Promise.resolve()
  .then ->
    throw global.myError.UnknownUser if not req.session
    throw global.myError.UnknownUser if not req.session.user
    User = global.db.models.user
    User.find(
      where:
        id : req.session.user.id
    )
  .then (user)->
    throw global.myError.UnknownUser if not user
    res.json {
      status : 1
      user : user
    }

  .catch global.myError.UnknownUser, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE