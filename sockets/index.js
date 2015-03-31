var account = require('./account.js');
var event = require('./../constants/event');
var url = require('url');

module.exports.install = function (wss) {
    //wss.use(function (socket, next) {
    //    socket.secret = socket.request._query['secret'];
    //    socket.action = socket.request._query['action'];
    //
    //    // FIXME stop handling request if secret OR action == null
    //
    //    next();
    //});

    wss.on('connection', function (socket) {
        var query = url.parse(socket.upgradeReq.url, true).query;
        socket.action = query.action;
        socket.secret = query.secret;
        switch (query.action) {
            case 'account':
                return account.connected(socket);
            default:
                socket.send(JSON.stringify({event: event.invalid_action}));
                return socket.terminate();
        }
    });


    wss.on('disconnect', function (socket) {
        var query = url.parse(socket.upgradeReq.url, true).query;
        switch (query.action) {
            case 'account':
                return account.disconnected(socket);
        }
    });
};

module.exports.Account = require("./account.js");





