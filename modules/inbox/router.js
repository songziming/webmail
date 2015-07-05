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
router.post('/list', controller.postList);
router.post('/detail', controller.postDetail);
router.post('/dispatch', controller.postDispatch);
router.post('/handle', controller.postHandle);
router.post('/update', controller.postUpdate);
router.post('/return', controller.postReturn);
router.post('/finish', controller.postFinish);


module.exports = router;