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
router.post('/create', controller.postCreate);
router.get('/list', controller.getList);
router.post('/update', controller.postUpdate);
router.post('/delete', controller.postDelete);

module.exports = router;