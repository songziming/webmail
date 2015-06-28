var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
// var expressSession = require('express-session');
var apiRouter  = require('./api/router');
var auth = require('./api/auth');
var viewRouter = require('./routes_me/route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(expressSession({secret: 'this is xecret'}));

app.use(auth.initialize());
// app.use(auth.session());

app.use('/api', apiRouter);
app.use('/', viewRouter);

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html','css','js','json'],
	index: false,
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path) {
		res.set('x-timestamp', Date.now())
	}
};

app.use(express.static('/static', options));

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

module.exports = app;
app.listen(8000, 'localhost', function() {
    console.log('Server starts listening on port 8000.');
});
