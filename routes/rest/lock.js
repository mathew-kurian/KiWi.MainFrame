var Lock = require('./../../models/lock.model');
var Key = require('./../../models/key.model');
var status = require('./../../constants/status');
var event = require('./../../constants/event');
var tools = require('./../../libs/tools');
var Mongol = require('./../../libs/mongol');
var config = require('./../../config');
var permission = require('./../../constants/permission');

module.exports = {
    debug: {
        list: function (req, res) {
            Lock.list({}, function (err, locks) {
                if (err)  return res.sendErr(status.db_err, err);
                for (var i = 0; i < locks.length; i++)
                    Mongol.Private.open(locks[i]);
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
                res.sendOk({locks: locks});
            });
        });
    },
    create: function (req, res) {
        // noinspection JSUnresolvedVariable
        Lock.create({serial: req.query.serial}, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            Key.create({account: req.token.account, lock: lock._id, permission: permission.owner}, function (err) {
                if (err) {
                    return lock.remove(lock._id, function (err) {
                        if (err) return res.sendErr(status.db_err, err);
                    });
                }
                res.sendOk({lock: lock});
                sockets.Account.emit('*', event.lock_created, {lock: lock});
            });
        });
    },
    register: function (req, res) {
        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.location) || req.query.location.length !== 2)
            return res.sendErr(status.param_err, "Invalid location");

        var password = tools.crypto.symmetric.decrypt(req.query.password, config.registration_algorithm, config.registration_password);

        if (config.registration_password !== password)
            return res.sendErr(status.key_err, "Encryption key invalid");

        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Lock.findOne({serial: req.query.serial}, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            if (!lock) return res.sendErr(status.db_err, "Lock not found");

            Mongol.Private.open(lock);
            Mongol.Private.set(lock, "registered", true);
            Mongol.Private.set(lock, "location", req.query.location);
            Mongol.Private.flush(lock);

            lock.save(function (err) {
                if (err) return res.sendErr(status.db_err, err);
                Key.findOne({permission: permission.owner, lock: lock._id}, function (err, key) {
                    if (err) return res.sendErr(status.db_err, err);
                    res.sendOk({info: "registered"});
                    sockets.Account.emit(key.account, event.lock_registered, {lock: lock});
                });
            });
        });
    }
};