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

router.post('/list', controller.postList);
router.post('/detail', controller.postDetail);
router.post('/audit', controller.postAudit);
router.post('/handle', controller.postHandle);


module.exports = router;