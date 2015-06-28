var express = require('express');
var auth = require('./auth');

var router = express.Router();

router.post('/register', function(req, res, next) {
    res.end('Register OK!');
});

router.post('/login', auth.authenticate('local', {
    failureRedirect: '/api/loginFail',
    successRedirect: '/api/loginOk'
//    failureFlash: true
}));

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
