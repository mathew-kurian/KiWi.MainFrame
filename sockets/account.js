var ShortId = require('ShortId');
var config = require('./../config');
var event = require('./../constants/event');
var sockets = {};
var socketsBySecret = {};

function SocketInfo(token, account) {
    this.token = token;
    this.account = account;
    this.secret = ShortId.generate();
    this.sockets = [];
}

module.exports.open = function (token, account) {
    if (!sockets[account]) sockets[account] = {};
    if (sockets[account][token]) return sockets[account][token].secret;
    var socketInfo = new SocketInfo(token, account);
    sockets[account][token] = socketInfo;
    socketsBySecret[socketInfo.secret] = socketInfo;
    return socketInfo.secret;
};

module.exports.close = function (token, account) {
    if (!sockets[account]) return 0;
    if (!sockets[account][token]) return 0;

    var socketInfo = sockets[account][token];
    var length = socketInfo.sockets.length;
    for (var i = 0; i < length; i++) {
        var socket = socketInfo.sockets[i];
        try {
            socket.send(JSON.stringify({event: event.disconnected, msg: "Disconnected upon request"}));
        } catch (e) {
            console.error(e);
        }
        console.log("socket disconnecting");
        socket.terminate();
    }

    delete sockets[account][token];
    delete socketsBySecret[socketInfo.secret];

    return length;
};

module.exports.connected = function (socket) {
    var socketInfo = socketsBySecret[socket.query.secret];
    if (!socketInfo || socketInfo.sockets.length >= config.max_sockets_per_token) {
        console.log("socket disconnecting secret:%s", socket.query.secret);
        socket.send(JSON.stringify({event: event.disconnected, msg: "Connection count > 3"}));
        socket.terminate();
        return;
    }

    console.log("socket connected secret:%s", socket.query.secret);
    socketInfo.sockets.push(socket);
    socket.send(JSON.stringify({event: event.connected}));
};

module.exports.disconnected = function (socket) {
    var socketInfo = socketsBySecret[socket.secret];
    if (!socketInfo) return console.error("Unexpected error: untracked socket");
    for (var i = 0; i < socketInfo.sockets.length; i++)
        if (socketInfo.sockets[i].id == socket.id)
            socketInfo.sockets.splice(--i, 1);

    console.error("Critical error: deleted socket id cannot be found. Security issue?")
};

module.exports.emit = function (account, event, data, msg) {
    if (account === '*') {
        for (var a in sockets)
            module.exports.emit(a, event, data, msg);
        return;
    }

    if (!sockets[account]) return;
    var d = JSON.stringify({event: event, msg: msg, data: data});
    for (var token in sockets[account]) {
        var socketInfo = sockets[account][token];
        for (var i = 0; i < socketInfo.sockets.length; i++)
            socketInfo.sockets[i].send(d);
    }
};