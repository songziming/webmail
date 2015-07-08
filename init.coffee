passwordHash = require('password-hash')
promise = require('sequelize').Promise
module.exports = (db) ->
  User = db.models.user
  Tag = db.models.tag
  User.create(
    username: 'test'
    password: passwordHash.generate('test')
    privilege: 'admin'
  )
  .then ->
    Tag.create content: "待分发"
  .then ->
    Tag.create content: "待回复"
  .then ->
    Tag.create content: "待审核"
  .then ->
    Tag.create content: "待发送"
  .then ->
    Tag.create content: "已回复"
  .then ->
    console.log 'ok'