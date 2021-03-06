/**
 * Created by ���� on 2015/6/29.
 */


var controller, express, modules, path, router;

express = require('express');

router = express.Router({
    mergeParams: true
});

controller = require('./controller');

path = require('path');

//router.post('/login', controller.postLogin);
router.get('/all', controller.getAll);
router.post('/add', controller.postAdd);
router.post('/del', controller.postDel);


module.exports = router;