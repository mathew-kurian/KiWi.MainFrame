var ShortId = require('ShortId');
var config = require('./../config');
var event = require('./../constants/event');
var tools = require('./../libs/tools')
var Lock = require('./../models/lock.model');
var Event = require('./../models/event.model');
var Key = require('./../models/key.model');
var _sockets = require('./index');
var sockets = {};
var socketsBySecret = {};

var MessageHandler = function (serial) {
    return function (msg, flags) {

        var updateLock = function (e, v) {
            Lock.findOne({serial: serial}, function (err, lock) {
                if (err) return console.error(err);
                if (!lock) return console.error("Lock not found");
                lock.locked = v;
                lock.save(function (err) {
                    if (err) return console.error(err);
                    Key.find({lock: lock._id}).distinct('account', function (err, keys) {
                        if (err) return console.error(err);
                        Event.create({
                            lock: lock._id,
                            event: e,
                            accountSrc: 1
                        }, function (err, event) {
                            if (err) return console.error(err);
                            (keys || []).forEach(function (key) {
                                _sockets.Account.emit(key.account, e, {lock: lock});
                                _sockets.Account.emit(key.account, event.new_event, event);
                            });
                        });
                    });
                });
            });
        };

        var data = JSON.parse(msg);

        console.log(data);

        switch (data.event) {
            case event.lock_manual:
            case event.lock_lock_command_fail:
            case event.lock_lock_command_success:
            case event.lock_unlock_command_fail:
            case event.lock_unlock_command_success:
                return updateLock(data.event, data.state);
        }
    }
};

var register = function (serial, reg) {
    // noinspection JSUnresolvedFunction, JSUnresolvedVariable
    Lock.findOne({serial: serial}, function (err, lock) {
        if (err) return console.error(err);
        if (!lock) return console.error("Lock not found");
        lock.registered = reg;
        lock.save(function (err) {
            if (err) return res.error(err);
            Key.find({lock: lock._id}).distinct('account', function (err, keys) {
                if (err) return console.error(err);
                Event.create({
                    lock: lock._id,
                    event: event.lock_registered,
                    accountSrc: 1
                }, function (err, event) {
                    if (err) return;
                    (keys || []).forEach(function (key) {
                        _sockets.Account.emit(key.account, reg ? event.lock_registered : event.lock_unregistered, {lock: lock});
                        _sockets.Account.emit(key.account, event.new_event, event);
                    });
                });
            });
        });
    });
}

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

    var password = tools.crypto.symmetric.decrypt(socket.query.password,
        config.registration_algorithm, config.registration_symmetric_key);

    var socketInfo = socketsBySecret[socket.query.secret];

    if (!socketInfo || password !== config.registration_password) {
        console.log("socket disconnecting secret:%s", socket.query.secret);
        socket.send(JSON.stringify({event: event.invalid_password, msg: "Connection count > 1"}));
        socket.terminate();
        return;
    }

    if (socketInfo.sockets.length >= config.max_sockets_per_lock) {
        console.log("socket disconnecting secret:%s", socket.query.secret);
        try {
            var _socket = socketInfo.sockets[0];
            _socket.send(JSON.stringify({event: event.disconnected, msg: "Connection count > 1"}));
            _socket.terminate();
        } catch (e) {
            console.error(e);
        }
    }

    // prepare handler
    socket.on('message', new MessageHandler(socketInfo.serial));

    register(socketInfo.serial, true);

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

    register(socketInfo.serial, false);

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