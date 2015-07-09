// Generated by CoffeeScript 1.9.3
(function() {
  var HOME_PAGE, sequelize;

  sequelize = require('sequelize');

  HOME_PAGE = '/';

  exports.postList = function(req, res) {
    return global.db.Promise.resolve().then(function() {
      var User;
      User = global.db.models.user;
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var Inbox, Outbox, base, base1, base2;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      Outbox = global.db.models.outbox;
      Inbox = global.db.models.inbox;
      if ((base = req.body).offset == null) {
        base.offset = 0;
      }
      if ((base1 = req.body).limit == null) {
        base1.limit = 20;
      }
      if ((base2 = req.body).lastMail == null) {
        base2.lastMail = 0;
      }
      return Outbox.findAndCountAll({
        where: (function() {
          switch (user.privilege) {
            case 'admin':
              return {
                id: (req.body.oldMail ? {
                  $lt: req.body.oldMail,
                  $gt: req.body.lastMail
                } : {
                  $gt: req.body.lastMail
                })
              };
            case 'auditor':
              return {
                id: (req.body.oldMail ? {
                  $lt: req.body.oldMail,
                  $gt: req.body.lastMail
                } : {
                  $gt: req.body.lastMail
                }),
                auditorId: {
                  $or: [null, user.id]
                }
              };
            case 'consumer':
              return {
                id: (req.body.oldMail ? {
                  $lt: req.body.oldMail,
                  $gt: req.body.lastMail
                } : {
                  $gt: req.body.lastMail
                }),
                consumerId: {
                  $or: [null, user.id]
                }
              };
            default:
              return {
                id: null
              };
          }
        })(),
        include: [
          {
            model: Inbox,
            as: 'replyTo'
          }
        ],
        limit: req.body.limit,
        order: [['id', 'DESC']]
      });
    }).then(function(result) {
      return res.json({
        status: 1,
        msg: 'Success',
        mails: result.rows,
        count: result.count
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postDetail = function(req, res) {
    return global.db.Promise.resolve().then(function() {
      var User;
      User = global.db.models.user;
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var Inbox, Outbox, base;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      Outbox = global.db.models.outbox;
      if ((base = req.body).mail == null) {
        base.mail = null;
      }
      Inbox = global.db.models.inbox;
      return Outbox.find({
        where: (function() {
          switch (user.privilege) {
            case 'admin':
              return {
                id: req.body.mail
              };
            case 'auditor':
              return {
                id: req.body.mail,
                auditorId: {
                  $or: [null, user.id]
                }
              };
            case 'consumer':
              return {
                id: req.body.mail,
                consumerId: {
                  $or: [null, user.id]
                }
              };
            case 'dispatcher':
              return {
                id: null
              };
          }
        })(),
        include: [
          {
            model: Inbox,
            as: 'replyTo'
          }
        ]
      });
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      return res.json({
        status: 1,
        msg: 'Success',
        mail: mail
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postAudit = function(req, res) {
    var currentMail, currentUser;
    currentMail = void 0;
    currentUser = void 0;
    return global.db.Promise.resolve().then(function() {
      var User;
      User = global.db.models.user;
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var Outbox;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      currentUser = user;
      Outbox = global.db.models.outbox;
      return Outbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      if (mail.status !== 'handled') {
        throw new global.myError.InvalidAccess();
      }
      switch (req.body.result) {
        case '1':
          mail.status = 'audited';
          break;
        case '0':
          mail.status = 'rejected';
      }
      if (mail.reason == null) {
        mail.reason = "";
      }
      mail.reason += req.body.reason;
      mail.auditor = req.session.id;
      return mail.save();
    }).then(function(mail) {
      var message;
      message = {};
      currentMail = mail;
      if (req.body.result === '1') {
        message = {
          title: "审核通过",
          html: "<p>您的邮件" + mail.title + "被审核<b>通过</b>了，现已加入发送队列</p>",
          text: "您的邮件" + mail.title + "被审核**通过**了，现已加入发送队列",
          senderId: 1,
          receivers: [currentMail.consumerId]
        };
      } else {
        message = {
          title: "审核未通过",
          html: "<p>您的邮件" + mail.title + "审核<b>未通过</b>了</p>",
          text: "您的邮件" + mail.title + "审核**未通过**",
          senderId: 1,
          receivers: [currentMail.consumerId]
        };
      }
      return global.myUtil.message.send(message);
    }).then(function() {
      return res.json({
        status: 1,
        mail: currentMail,
        msg: 'Success'
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postHandle = function(req, res) {
    var Outbox, User, currentConsumer;
    User = global.db.models.user;
    Outbox = global.db.models.outbox;
    currentConsumer = void 0;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = user.privilege) === 'admin' || ref === 'consumer')) {
        throw new global.myError.InvalidAccess();
      }
      currentConsumer = user;
      return Outbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      if (mail.consumerId !== currentConsumer.id) {
        throw new global.myError.InvalidAccess();
      }
      if (mail.status !== 'rejected') {
        throw new global.myError.InvalidAccess();
      }
      mail.status = 'handled';
      if (req.body.title) {
        mail.title = req.body.title;
      }
      if (req.body.auditorId) {
        mail.auditorId = req.body.auditorId;
      }
      if (req.body.html) {
        mail.html = req.body.html;
      }
      if (req.body.text) {
        mail.text = req.body.text;
      }
      if (req.body.to) {
        mail.to = req.body.to;
      }
      return mail.save();
    }).then(function(mail) {
      return res.json({
        status: 1,
        msg: "Success",
        mail: mail
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postEdit = function(req, res) {
    var Outbox, User, currentAuditor;
    User = global.db.models.user;
    Outbox = global.db.models.outbox;
    currentAuditor = void 0;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = user.privilege) === 'admin' || ref === 'auditor')) {
        throw new global.myError.InvalidAccess();
      }
      currentAuditor = user;
      return Outbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      if (mail.auditorId !== currentAuditor.id) {
        throw new global.myError.InvalidAccess();
      }
      if (mail.status !== 'handled') {
        throw new global.myError.InvalidAccess();
      }
      if (req.body.title) {
        mail.title = req.body.title;
      }
      if (req.body.html) {
        mail.html = req.body.html;
      }
      if (req.body.text) {
        mail.text = req.body.text;
      }
      if (req.body.to) {
        mail.to = req.body.to;
      }
      return mail.save();
    }).then(function(mail) {
      return res.json({
        status: 1,
        msg: "Success",
        mail: mail
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

}).call(this);

//# sourceMappingURL=controller.js.map
