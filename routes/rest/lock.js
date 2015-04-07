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
                }, function (err, event) {
                    res.sendOk({lock: lock});
                    sockets.Account.emit(req.token.account, event.lock_created, {lock: lock})
                    sockets.Account.emit(req.token.account, event.new_event, event)
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
                    lock: key.lock,
                    event: event.lock_edit,
                    accountSrc: req.token.account
                }, function (err, event) {
                    Key.find({lock: lock._id}).distinct("account", function (err, accounts) {
                        for (var i = 0; i < accounts.length; i++) {
                            sockets.Account.emit(accounts[i], event.lock_edit, merge_res);
                            sockets.Account.emit(accounts[i], event.new_event, event);
                        }
                    });
                });
            });
        });
    },
    events: function (req, res) {
        Event.list({lock: req.query.lock}, function (err, events) {
            if (err) return res.sendErr(status.db_err, err);
            res.sendOk({events: events});
        });
    },
    register: function (req, res) {
        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.location) || req.query.location.length !== 2)
            return res.sendErr(status.param_err, "Invalid location");

        var password = tools.crypto.symmetric.decrypt(req.query.password, config.registration_algorithm, config.registration_symmetric_key);

        if (config.registration_password !== password)
            return res.sendErr(status.key_err, "Encryption key invalid");

        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Lock.findOne({serial: req.query.serial}, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            if (!lock) return res.sendErr(status.db_err, "Lock not found");

            lock.regisered = true;
         // FIXME
         //   lock.location = req.query.location;

            lock.save(function (err) {
                if (err) return res.sendErr(status.db_err, err);
                Key.findOne({permission: permission.owner, lock: lock._id}, function (err, key) {
                    if (err) return res.sendErr(status.db_err, err);
                    res.sendOk({info: "registered"});

                    Event.create({
                        lock: key.lock,
                        event: event.lock_registered,
                        accountSrc: 1
                    }, function (err, event) {
                        Key.list({criteria: {lock: lock._id}}, function (err, keys) {
                            if (err) return;
                            (keys || []).forEach(function (key) {
                                sockets.Account.emit(key.account, event.lock_registered, {lock: lock});
                                sockets.Account.emit(key.account, event.new_event, event);
                            });
                        });
                    });
                });
            });
        });
    }
};