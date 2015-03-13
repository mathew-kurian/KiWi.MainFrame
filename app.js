var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsx = require('node-jsx');
var scribe = require('scribe-js')();
var sockets = require('./sockets');
var mongoose = require("mongoose");
var http = require('http');
var React = require('react');

// noinspection JSUnresolvedVariable
var port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/kiwi-mainframe');
jsx.install({extension: '.jsx'});

var reactApp = require('./asr/app.jsx');
var app = express();
var io = require('socket.io').listen(app.listen(port));

sockets.install(io.sockets);

app.use('/', require('./routes'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// noinspection JSUnresolvedVariable
app.use(scribe.express.logger());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// noinspection JSUnresolvedFunction
app.use(bodyParser.urlencoded({extended: false}));

// noinspection JSUnresolvedFunction
app.use('/logs', scribe.webPanel());

app.get('/', function (req, res) {
    var markup = React.renderComponentToString(reactApp());
    res.send('<!DOCTYPE html>' + markup);
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {message: err.message, error: {}});
});


