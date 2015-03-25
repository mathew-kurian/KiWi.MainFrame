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
    for (var i = 0; i < length; i++){
        var socket = socketInfo.sockets[i];
        socket.emit('*', {event: event.disconnected, msg: "Disconnected upon request"});
        console.log("socket disconnecting id:%s", socket.id);
        socket.disconnect('unauthorized');
    }

    delete sockets[account][token];
    delete socketsBySecret[socketInfo.secret];

    return length;
};

module.exports.connected = function (socket) {
    var socketInfo = socketsBySecret[socket.secret];
    if (!socketInfo || socketInfo.sockets.length >= config.max_sockets_per_token) {
        console.log("socket disconnecting id:%s secret:%s", socket.id, socket.secret);
        socket.emit('*', {event: event.disconnected, msg: "Connection count > 3"});
        socket.disconnect('unauthorized');
        return;
    }

    console.log("socket connected id:%s secret:%s", socket.id, socket.secret);

    socketInfo.sockets.push(socket);

    socket.emit('*', {event: event.connected});
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
    if(account === '*'){
        for(var a in sockets)
            module.exports.emit(a, event, data, msg);
        return;
    }

    if (!sockets[account]) return;
    for (var token in sockets[account]) {
        var socketInfo = sockets[account][token];
        for (var i = 0; i < socketInfo.sockets.length; i++)
            socketInfo.sockets[i].emit('*', {event: event, msg: msg, data: data});
    }
};