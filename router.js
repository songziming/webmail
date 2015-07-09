/**
 * Created by ���� on 2015/6/29.
 */
modules = require("./modules");
var ueditor = require('./ued');

var express, modules, router;

express = require('express');

router = express.Router();

router.get('/', function (req, res) {
    console.log("get index");
    res.render('views/pages/index');
});

router.post('/lmysaaby', function(req, res) {
    console.log(req.body);
    res.end('I got you!');
});

router.use('/user', modules.user.router);
router.use('/inbox', modules.inbox.router);
router.use('/outbox', modules.outbox.router);
router.use('/tag', modules.tag.router);
router.use('/message', modules.message.router);
router.use('/config', modules.config.router);
router.get('/ue', ueditor);
router.post('/ue', ueditor);

module.exports = router;
