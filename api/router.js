var express = require('express');
var auth = require('./auth');

var router = express.Router();

router.post('/register', function(req, res, next) {
    res.end('Register OK!');
});

router.post('/login', function(req, res) {
    var db = global.db;
    var form = {
        username : req.body.username,
        password : req.body.password
    };
    var User = db.models.user;
    User.find({
        where: {
            username: req.body.username
        }
    }).then(function(user){

    })

});

router.post('/register', function(req, res){
    var User, form;
    form = {
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        school: req.body.school
    };
    User = global.db.models.user;
    return global.db.Promise.resolve().then(function() {
        if (form.password !== req.body.password2) {
            throw new myUtils.Error.RegisterError("Please confirm your password.");
        }
        form.password = passwordHash.generate(form.password);
        return User.create(form);
    }).then(function(user) {
        myUtils.login(req, res, user);
        req.flash('info', 'You have registered.');
        return res.redirect(HOME_PAGE);
    })["catch"](global.db.ValidationError, function(err) {
        req.flash('info', err.errors[0].path + " : " + err.errors[0].message);
        return res.redirect(REGISTER_PAGE);
    })["catch"](myUtils.Error.RegisterError, function(err) {
        req.flash('info', err.message);
        return res.redirect(REGISTER_PAGE);
    })["catch"](function(err) {
        console.log(err);
        req.flash('info', "Unknown Error!");
        return res.redirect(HOME_PAGE);
    });
});

router.get('/loginFail', function(req, res) {
    //res.write('res'+JSON.toString(req));
    res.end('Your login has just FAILED!!!');
});
router.get('/loginOk', function(req, res) {
    res.end('You\'re pretty clever');
});

router.post('/logout', function(req, res, next) {
    res.end('Logout OK!');
});

router.get('/', function(req, res, next) {
    res.end('You Are Saaby!');
});


module.exports = router;
