var ShortId = require('ShortId');
var config = require('./../config');
var event = require('./../constants/event');
var sockets = {};
var socketsBySecret = {};

function SocketInfo(serial) {
    this.serial = serial;
    this.secret = ShortId.generate();
    this.sockets = [];
}

module.exports.open = function (serial) {
    if (sockets[serial]) return sockets[serial].secret;
    var socketInfo = new SocketInfo(serial);
    sockets[serial] = socketInfo;
    socketsBySecret[socketInfo.secret] = socketInfo;
    return socketInfo.secret;
};

module.exports.close = function (serial) {
    if (!sockets[serial]) return 0;

    var socketInfo = sockets[serial];
    var length = socketInfo.sockets.length;
    for (var i = 0; i < length; i++) {
        var socket = socketInfo.sockets[i];
        try {
            socket.send(JSON.stringify({event: event.disconnected, msg: "Disconnected upon request"}));
        } catch (e) {
            console.error(e);
        }
        console.log("socket disconnecting id:%s", socket.id);
        socket.terminate();
    }

    delete sockets[serial];
    delete socketsBySecret[socketInfo.secret];

    return length;
};

module.exports.connected = function (socket) {
    var socketInfo = socketsBySecret[socket.secret];
    if (!socketInfo || socketInfo.sockets.length >= config.max_sockets_per_lock) {
        console.log("socket disconnecting id:%s secret:%s", socket.id, socket.secret);
        socket.send(JSON.stringify({event: event.disconnected, msg: "Connection count > 3"}));
        socket.terminate();
        return;
    }

    console.log("socket connected id:%s secret:%s", socket.id, socket.secret);

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

module.exports.emit = function (serial, event, data, msg) {
    if (serial === '*') {
        for (var a in sockets)
            module.exports.emit(a, event, data, msg);
        return;
    }

    if (!sockets[serial]) return;
    var socketInfo = sockets[serial];
    for (var i = 0; i < socketInfo.sockets.length; i++)
        socketInfo.sockets[i].send(JSON.stringify({event: event, msg: msg, data: data}));
};