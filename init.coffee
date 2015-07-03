passwordHash = require('password-hash')
module.exports = (db) ->
  User = db.models.user
  User.create(
    username: 'test'
    password: passwordHash.generate('test')
    privilege: 'admin'
  ).then ->
    console.log 'ok'