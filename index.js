var path = require('path');
var http = require('http');
var logger = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var router = require('./router');
var config = require('./config');

// create express instance
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// logger
app.use(logger('dev'));

// parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw({type: 'application/x-www-form-urlencoded'}));
app.use(cookieParser());

// template directory
app.use(express.static(path.join(__dirname, 'static')));

// session
var redisStore = require('connect-redis')(session);
app.use(session({
    secret: 'mxx',
    resave: false,
    saveUninitialized: true,
    store: new redisStore(),
    cookie: {maxAge: 1000 * 60 * 60 * 24} //null to create a browser-session
}));

// top level router, all views and apis go there
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

/* ========================================================================== */

// mail module, send and receive email in background
var mail = require('./mail');
mail.initMailConfig(config.mail);
mail.startGettingMail();
mail.startSender(config.mail);

//mail.sendMail('<lmysoar@hotmail.com>', 'hi', 'sent by node.js', function(err, info) {
//    console.log(err, info.response);
//});

var db = require('./database')(
    config.database.name,
    config.database.username,
    config.database.password,
    config.database.config
);
global.db = db;

global.myError = require('./errors');
global.myUtil = require('./utils');

http.createServer(app).listen(8000, 'localhost', function() {
    console.log('Server starts listening on port 8000.');
});
