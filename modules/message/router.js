/**
 * Created by Ã÷Ñô on 2015/6/29.
 */


var controller, express, modules, path, router;

express = require('express');

router = express.Router({
    mergeParams: true
});

controller = require('./controller');

path = require('path');

//router.post('/login', controller.postLogin);
router.post('/send', controller.postSend);
router.post('/receive', controller.postReceive);
router.post('/sent', controller.postSent);
router.post('/read', controller.postRead);

module.exports = router;