/**
 * Created by Ã÷Ñô on 2015/6/29.
 */


var controller, express, modules, path, router;

express = require('express');

router = express.Router({
    mergeParams: true
});

controller = require('./controller');

// this file was added by szm
var crud = require('./crud');

path = require('path');

//router.post('/login', controller.postLogin);
router.post('/login', controller.postLogin);

router.get('/logout', controller.getLogout);

router.post('/logout', controller.postLogout);

router.get('/info', controller.getInfo);

router.get('/all', controller.getAll);

// added by szm
router.post('/privilege', crud.privilege);
router.post('/add', crud.add);
router.post('/del', crud.del);

module.exports = router;