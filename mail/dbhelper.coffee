TAG_RECEIVED  = 1
TAG_ASSIGNED = 2
TAG_HANDLED = 3
TAG_AUDITED = 4
TAG_FINISHED = 5

module.exports = (title, from, text, html)->
  Inbox = global.db.models.inbox
  Inbox
    .create {
      title : title
      from : from
      text : text
      html : html
      status : 'received'
    }
    .then (mail)->
      mail.setTags([TAG_RECEIVED])
    .catch (err)->
      console.log err
