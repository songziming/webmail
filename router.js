/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
var express, modules, router;

modules = require("./modules");

express = require('express');

router = express.Router({
    mergeParams: true
});

router.use('/user', modules.user.router);

router.get('/', function (req, res) {
    console.log("hehe");
    res.json({
        status : 1
    });
});




module.exports = router;