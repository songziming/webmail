var http = require('http');
var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.end('Hello, world!');
});

var server = http.createServer(app);
server.listen(8080, 'localhost', function() {
    console.log('Server started.');
});
