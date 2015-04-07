var Reflux = require('reflux');
var AppActions = require('./../actions/app-actions');
var $ = require('jquery');

var LockStore = Reflux.createStore({
    locks: {},
    token: undefined,
    listenables: [AppActions],

    forceUpdate: function (lock) {
        console.log(lock);

        LockStore.locks[lock._id] = lock;
        LockStore.trigger(LockStore.locks);
    },

    _onLogin: 0,
    onLogin: function (token) {
        if (LockStore._onLogin++) return;
        LockStore.token = token;
        $.get("/rest/lock/list?client_id=dev&token=" + LockStore.token, function (res) {
            if (res.status) {
                LockStore._onLogin = 0;
                return notify(res.msg);
            }

            var locks = res.data.locks;
            for (var i = 0; i < locks.length; i++)
                LockStore.locks[locks[i]._id] = locks[i];
            LockStore.trigger(LockStore.locks);
            LockStore._onLogin = 0;
        });
    },

    _onCreateLock: 0,
    onCreateLock: function (serial) {
        if (LockStore._onCreateLock++) return;
        $.get("/rest/lock/create?client_id=dev&token=" + LockStore.token + "&serial=" + serial, function (res) {
            if (res.status) {
                LockStore._onCreateLock = 0;
                return notify(res.msg);
            }

            LockStore.locks[res.data.lock._id] = res.data.lock;
            LockStore.trigger(LockStore.locks);
            LockStore._onCreateLock = 0;
        });
    },

    _onLock: 0,
    onLock: function (id) {
        if (LockStore._onLock++) return;
        $.get("/rest/lock/lock?client_id=dev&token=" + LockStore.token + "&lock=" + id, function (res) {
            if (res.status) {
                LockStore._onLock = 0;
                return notify(res.msg);
            }

            LockStore._onLock = 0;
        });
    },

    _onUnlock: 0,
    onUnlock: function (id) {
        if (LockStore._onUnlock++) return;
        $.get("/rest/lock/unlock?client_id=dev&token=" + LockStore.token + "&lock=" + id, function (res) {
            if (res.status) {
                LockStore._onUnlock = 0;
                return notify(res.msg);
            }

            LockStore._onUnlock = 0;
        });
    },

    _onRenameLockTid: 0,
    onRenameLock: function (id, name) {
        LockStore.locks[id].name = name;
        LockStore.trigger(LockStore.locks);

        clearTimeout(LockStore._onRenameLockTid);
        LockStore._onRenameLockTid = setTimeout(function () {
            $.get("/rest/lock/edit?client_id=dev&token=" + LockStore.token + "&lock=" + id + "&fields[0][name]=name&fields[0][value]=" + name, function (res) {
                if (res.status) {
                    return notify(res.msg);
                }

                notify("Locked renamed to `" + name + "`");
            });
        }, 1000);
    }
});

module.exports = LockStore;