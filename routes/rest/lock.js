var Lock = require('./../../models/lock.model');
var Key = require('./../../models/key.model');
var status = require('./../../constants/status');
var event = require('./../../constants/event');
var tools = require('./../../libs/tools');
var Event = require('./../../models/event.model');
var config = require('./../../config');
var permission = require('./../../constants/permission');
var sockets = require('./../../sockets');

module.exports = {
    debug: {
        list: function (req, res) {
            Lock.list({}, function (err, locks) {
                if (err)  return res.sendErr(status.db_err, err);
                res.sendOk({locks: locks});
            });
        }
    },
    list: function (req, res) {
        Key.list({criteria: {account: req.token.account}}, function (err, keys) {
            if (err)  return res.sendErr(status.db_err, err);
            var locks = [];
            for (var i = 0; i < keys.length; i++) locks.push(keys[i].lock);
            Lock.list({criteria: {_id: {$in: locks}}}, function (err, locks) {
                if (err)  return res.sendErr(status.db_err, err);
                // FIXME open only the correct ones
                res.sendOk({locks: locks});
            });
        });
    },
    create: function (req, res) {
        // noinspection JSUnresolvedVariable
        Lock.create({serial: req.query.serial}, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            Key.create({account: req.token.account, lock: lock._id, permission: permission.owner}, function (err, key) {
                if (err) {
                    return lock.remove(function (err) {
                        if (err) return res.sendErr(status.db_err, err);
                    });
                }

                Event.create({
                    lock: key.lock,
                    event: event.lock_created,
                    accountSrc: req.token.account
                }, function (err, _event) {
                    res.sendOk({lock: lock});
                    sockets.Account.emit(req.token.account, event.lock_created, {lock: lock})
                    sockets.Account.emit(req.token.account, event.new_event, _event)
                });
            });
        });
    },
    edit: function (req, res) {
        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.fields))
            return res.sendErr(status.param_err, "Invalid field type");

        // noinspection JSUnresolvedFunction
        Lock.findById(req.query.lock, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            if (!lock) return res.sendErr(status.db_err, "Account not found");

            var merge_res = tools.merge(lock, req.query.fields, 'lock', ['location', 'locked', 'enabled', 'battery', 'registered', 'serial']);

            if (!merge_res.save) return res.sendOk(merge_res);

            lock.save(function (err) {
                if (err) return res.sendErr(status.db_err, err);
                res.sendOk(merge_res);

                Event.create({
                    lock: lock._id,
                    event: event.lock_edit,
                    accountSrc: req.token.account
                }, function (err, _event) {
                    Key.find({lock: lock._id}, function (err, keys) {
                        for (var i = 0; i < keys.length; i++) {
                            sockets.Account.emit(keys[i].account, event.lock_edit, merge_res);
                            sockets.Account.emit(keys[i].account, event.new_event, _event);
                        }
                    });
                });
            });
        });
    },
    lock: function (req, res) {
        Lock.findById(req.query.lock, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            if (!lock) return res.sendErr(status.db_err, "Lock not found");

            if (lock.registered) {
                sockets.Lock.emit(lock.serial, event.lock_lock_command);
                res.sendOk({info: "Command issued"});

                Event.create({
                    lock: lock._id,
                    event: event.lock_lock_command,
                    accountSrc: req.token.account
                }, function (err, _event) {
                    Key.find({lock: lock._id}, function (err, keys) {
                        for (var i = 0; i < keys.length; i++) {
                            sockets.Account.emit(keys[i].account, event.lock_lock_command);
                            sockets.Account.emit(keys[i].account, event.new_event, _event);
                        }
                    });
                });
            } else {
                res.sendErr(event.lock_register_err, "Lock is not registered");
            }
        });
    },
    unlock: function (req, res) {
        Lock.findById(req.query.lock, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            if (!lock) return res.sendErr(status.db_err, "Lock not found");

            if (lock.registered) {
                sockets.Lock.emit(lock.serial, event.lock_unlock_command);
                res.sendOk({info: "Command issued"});

                Event.create({
                    lock: lock._id,
                    event: event.lock_unlock_command,
                    accountSrc: req.token.account
                }, function (err, _event) {
                    Key.find({lock: lock._id}, function (err, keys) {
                        console.log(keys);
                        for (var i = 0; i < keys.length; i++) {
                            sockets.Account.emit(keys[i].account, event.lock_unlock_command);
                            sockets.Account.emit(keys[i].account, event.new_event, _event);
                        }
                    });
                });
            } else {
                res.sendErr(event.lock_register_err, "Lock is not registered");
            }
        });
    },
    events: function (req, res) {
        Event.list({criteria: {lock: req.query.lock}}, function (err, events) {
            if (err) return res.sendErr(status.db_err, err);
            res.sendOk({events: events});
        });
    }
};