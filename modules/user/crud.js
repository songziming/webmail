var hash = require('password-hash');
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
        User.update({
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