var account = require('./account.js');
var lock = require('./lock.js');
var event = require('./../constants/event');
var url = require('url');

module.exports.install = function (wss) {

    wss.on('connection', function (socket) {
        socket.query = url.parse(socket.upgradeReq.url, true).query;
        switch (socket.query.action) {
            case 'account':
                return account.connected(socket);
            case 'lock':
                return lock.connected(socket);
            default:
                socket.send(JSON.stringify({event: event.invalid_action}));
                return socket.terminate();
        }
    });

    wss.on('disconnect', function (socket) {
       socket.query = url.parse(socket.upgradeReq.url, true).query;
        switch (socket.query.action) {
            case 'account':
                return account.disconnected(socket);
            case 'lock':
                return lock.disconnected(socket);
        }
    });
};

module.exports.Account = require("./account.js");
module.exports.Lock = require("./lock.js");





