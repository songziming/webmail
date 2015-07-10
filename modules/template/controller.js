// Generated by CoffeeScript 1.9.3
(function() {
  var Promise;

  Promise = require('sequelize').Promise;

  exports.postCreate = function(req, res) {
    var Template, User;
    User = global.db.models.user;
    Template = global.db.models.template;
    return Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (user.privilege !== 'admin') {
        throw new global.myError.InvalidAccess();
      }
      return Template.create({
        name: req.body.name,
        html: req.body.html,
        text: req.body.text
      });
    }).then(function(template) {
      return res.json({
        status: 1,
        msg: "Success",
        template: template
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.getList = function(req, res) {
    var Template;
    Template = global.db.models.template;
    return Template.findAll().then(function(templates) {
      return res.json({
        status: 1,
        msg: "Success",
        templates: templates
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postUpdate = function(req, res) {
    var Template, User;
    Template = global.db.models.template;
    User = global.db.models.user;
    return Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (user.privilege !== "admin") {
        throw new global.myError.InvalidAccess();
      }
      return Template.findById(req.body.template);
    }).then(function(template) {
      if (!template) {
        throw new global.myError.UnknownTemplate();
      }
      if (req.body.name) {
        template.name = req.body.name;
      }
      if (req.body.html) {
        template.html = req.body.html;
      }
      if (req.body.text) {
        template.text = req.body.text;
      }
      return template.save();
    }).then(function(template) {
      return res.json({
        status: 1,
        msg: "Success",
        template: template
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postDelete = function(req, res) {
    var Template, User;
    Template = global.db.models.template;
    User = global.db.models.user;
    return Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (user.privilege !== "admin") {
        throw new global.myError.InvalidAccess();
      }
      return Template.destroy({
        where: {
          id: req.body.template
        }
      });
    }).then(function() {
      return res.json({
        status: 1,
        msg: "Success"
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
