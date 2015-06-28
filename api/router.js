var express = require('express');
var router = express.Router();

router.post('/register', function(req, res, next) {
    res.end('Register OK!');
});

router.post('/login', function(req, res, next) {
    res.end('Login OK!');
});

router.post('/logout', function(req, res, next) {
    res.end('Logout OK!');
});

router.get('/', function(req, res, next) {
    res.end('You Are Saaby!');
});


module.exports = router;
