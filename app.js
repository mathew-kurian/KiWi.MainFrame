var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodejsx = require('node-jsx');
var scribe = require('scribe-js')();
var app = express();
var mongoose = require("mongoose");

// Imgur
// a5eea26247b3dda
// f6ff9173371fb4fe3cabd46945f91e066942f03b

mongoose.connect('mongodb://localhost/kiwi-mainframe');

nodejsx.install({
    extension: '.jsx'
});

var reactApp = require('./asr/app.jsx');
var React = require('react');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(scribe.express.logger()); //Log each request
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/logs', scribe.webPanel());

// Render React on Server
app.get('/', function (req, res) {
    var markup = React.renderComponentToString(reactApp());
    res.send('<!DOCTYPE html>' + markup);
});

app.use('/rest', require('./routes/rest'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
