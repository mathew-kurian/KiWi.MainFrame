var Lock = require('./../../models/lock.model.js');
var Key = require('./../../models/key.model.js');
var status = require('./../../constants/status');
var tools = require('./../../libs/tools');
var config = require('./../../config');
var permission = require('./../../constants/permission');

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
        Lock.list({criteria: {account: res.token.account}}, function (err, locks) {
            if (err)  return res.sendErr(status.db_err, err);
            res.sendOk({locks: locks});
        });
    },
    create: function (req, res) {
        // noinspection JSUnresolvedVariable
        Lock.create({serial: req.query.serial}, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            Key.create({account: res.token.account, lock: lock._id, permission: permission.owner}, function (err) {
                if (err) {
                    return lock.remove(lock._id, function (err) {
                        if (err) return res.sendErr(status.db_err, err);
                    });
                }
                res.sendOk({lock: lock});
            });
        });
    },
    register: function (req, res) {
        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.location) || req.query.location.length !== 2)
            return res.sendErr(status.param_err, "Invalid location");

        var decipher = crypto.createDecipher(config.registrationAlgorithm, config.registrationPassword);
        var dec = decipher.update(text, 'hex', 'utf8');

        if (config.registrationPassword !== (dec + decipher.final('utf8')))
            return res.sendErr(status.key_err, "Encryption key invalid");

        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Lock.findOne({serial: req.query.serial}, function (err, lock) {
            if (err) return res.sendErr(status.db_err, err);
            if (!lock) return res.sendErr(status.db_err, "Lock not found");

            lock.registered = true;
            // noinspection JSUnresolvedVariable
            lock.location = req.query.location;
            lock.save(function (err) {
                if (err) return res.sendErr(status.db_err, err);
                res.sendOk({info: "registered"});
            });
        });
    }
};