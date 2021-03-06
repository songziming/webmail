var hash = require('password-hash');
var sequelize = require('sequelize');
var HOME_PAGE = '/';

exports.privilege = function(req, res) {
    // TODO: 希望改成这种样子，以后如果想要改出错信息比较好改，同时写的代码会很少
    global.db.Promise.resolve()
    .then(function() {
        var User = global.db.models.user;
        // first check if current user is admin
        if (req.session.user.privilege != 'admin') throw new global.myError.InvalidAccess(); // TODO : 不要这样判断，如果我改了这个用户的身份，他的session的privilege就不对了，所以要查数据库啊
        // get data
        var ids = JSON.parse(req.body.users);
        var priv = req.body.privilege;
        return User.update({
            privilege: priv
        }, {
            where: {
                id: ids
            }
        })
    }).then(function() {
        res.json({
            status: 1,
            msg: "Success"
        });
    }).catch(global.myError.InvalidAccess, function(err) {
        res.json({
            status: 0,
            msg: err.message
        });
    }).catch(function(err){
        console.log(err);
        res.redirect(HOME_PAGE);
    });
};

exports.add = function(req, res) {
    global.db.Promise.resolve()
    .then(function() {
        var User = global.db.models.user;
        if (!req.session.user) {
            throw new global.myError.UnknownUser();
        }
        return User.findById(req.session.user.id);
    }).then(function(user) {
        if (user.privilege != 'admin') {
            throw new global.myError.InvalidAccess();
        }
        var User = global.db.models.user;
        return User.create({
            username : req.body.username,
            password : hash.generate(req.body.password),
            privilege : req.body.privilege
        });
    }).then(function(user){
        res.json({
            status : 1,
            msg : 'Success',
            'user' : user
        });
    }).catch(global.myError.InvalidAccess, function(err) {
        res.json({
            status: 0,
            msg: err.message
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: 0,
            msg: err.message
        });
    });
};

exports.update = function(req, res) {
    global.db.Promise.resolve()
        .then(function() {
            var User = global.db.models.user;
            if (!req.session.user) {
                throw new global.myError.UnknownUser();
            }
            return User.findById(req.session.user.id);
        }).then(function(user) {
            if (user.privilege != 'admin') {
                throw new global.myError.InvalidAccess();
            }
            var User = global.db.models.user;
            if(req.body.password) {
                req.body.password = hash.generate(req.body.password);
            }
            return User.update(req.body, {
                where : {
                    id: req.body.userId
                }
            });
        }).then(function(){
            res.json({
                status : 1,
                msg : 'Success'
            });
        }).catch(global.myError.InvalidAccess, sequelize.ValidationError, function(err) {
            res.json({
                status: 0,
                msg: err.message
            });
        }).catch(function(err) {
            console.log(err);
            res.json({
                status: 0,
                msg: err.message
            });
        });
};
exports.orig_add = function(req, res) {
// TODO: should be improved, currently use the old way
var User = global.db.models.user;

    // first check if current user is admin
    if (req.session.user.privilege != 'admin') {
        res.json({
            status: 0,
            msg: "Invalid Access"
        });
    }
    // TODO: Im not kidding, it's true!
    var name = req.body.username || 'lmysaaby';
    var pass = req.body.password || 'empty';
    var priv = req.body.privilege || 'consumer';    // consumer is the default role
    User.create({
        username: name,
        password: hash.generate(pass),
        privilege: priv
    }).then(function() {
        res.json({
            status: 1,
            msg: "Success"
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: 0,
            msg: err.message
        });
    });
};

exports.del = function(req, res) {
    global.db.Promise.resolve()
    .then(function() {
        var User = global.db.models.user;
        if (!req.session.user) {
            throw new global.myError.UnknownUser();
        }
        return User.findById(req.session.user.id);
    }).then(function(user) {
        if (user.privilege != 'admin') {
            throw new global.myError.InvalidAccess();
        }
        var User = global.db.models.user;
        if(typeof(req.body.users) === "string")
            req.body.users = JSON.parse(req.body.users);
        return User.destroy({
            where: {
                id: req.body.users
            }
        });
    }).then(function(user){
        res.json({
            status : 1,
            msg : 'Success'
        });
    }).catch(global.myError.InvalidAccess, function(err) {
        res.json({
            status: 0,
            msg: err.message
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: 0,
            msg: err.message
        });
    });
};

exports.orig_del = function(req, res) {
// TODO: should be improved, currently use the old way
var User = global.db.models.user;

    // first check if current user is admin
    if (req.session.user.privilege != 'admin') {
        res.json({
            status: 0,
            msg: "Invalid Access"
        });
    }

    var users = JSON.parse(req.body.users);
    User.destroy({
        where: {
            id: users
        }
    }).then(function() {
        res.json({
            status: 1,
            msg: "Success"
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: 0,
            msg: err.message
        });
    });
};
