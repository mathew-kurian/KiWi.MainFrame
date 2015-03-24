var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsx = require('node-jsx');
var scribe = require('scribe-js')();
var sockets = require('./sockets');
var mongoose = require("mongoose");
var http = require('http');
var compression = require('compression')
var React = require('react');

// noinspection JSUnresolvedVariable
var port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/kiwi-mainframe');
jsx.install({extension: '.jsx'});

var reactApp = require('./asr/app.jsx');
var app = express();
var io = require('socket.io').listen(app.listen(port));

sockets.install(io);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// noinspection JSUnresolvedVariable
app.use(scribe.express.logger());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(compression());
// noinspection JSUnresolvedFunction
app.use(bodyParser.urlencoded({extended: false}));

// noinspection JSUnresolvedFunction
app.use('/logs', scribe.webPanel());
app.use('/', require('./routes'));

app.get('/dashboard', function (req, res) {
    var markup = React.renderComponentToString(reactApp());
    res.send('<!DOCTYPE html>' + markup);
});

app.use(function (req, res) {
    var err = new Error('Url Not found');
    res.render('error', {message: err.message, status: 404, stack: err.stack});
});

app.use(function (err, req, res) {
    console.log(err);
    res.render('error', {message: err.message, status: err.status || 500, stack: err.stack});
});


