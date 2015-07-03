/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
modules = require("./modules");

var express, modules, router;

express = require('express');

router = express.Router({
    mergeParams: true
});

router.get('/', function (req, res, next) {
    console.log("hehe");
    res.json({
        status : 1
    });
});

//router.use('/user', modules.user.router);



module.exports = router;