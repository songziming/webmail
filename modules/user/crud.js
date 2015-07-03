var hash = require('password-hash');


exports.privilege = function(req, res) {
// TOOD: should be improved, currently use the old way
var User = global.db.models.user;

    // first check if current user is admin
    if (req.session.user.privilege != 'admin') {
        res.json({
            status: 0,
            msg: "Invalid Access"
        });
        return
    }

    // get data
    var ids = JSON.parse(req.body.users);
    var priv = req.body.privilege;
    // for (var user in data) {
    //     if (!!user.id && !!user.privilege) {
    //         User.findById(user.id).then(function(u) {
    //             u.privilege = user.privilege;
    //             User.update(u);
    //         });
    //     }
    // }
    User.update({
        'privilege': priv
    }, {
        where: {
            id: ids
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

exports.add = function(req, res) {
// TOOD: should be improved, currently use the old way
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
// TOOD: should be improved, currently use the old way
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