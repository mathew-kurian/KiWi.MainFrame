var Key = require('./../../models/key.model.js');
var status = require('./../../constants/status');
var permission = require('./../../constants/permission');

module.exports = {
    debug: {
        list: function (req, res) {
            Key.list({}, function (err, keys) {
                if (err)  return res.sendErr(status.db_err, err);
                res.sendOk({keys: keys});
            });
        }
    },
    create: function (req, res) {
        // noinspection JSUnresolvedVariable
        var expires = new Date(req.query.expires);

        if (expires.getTime() <= Date.now() || isNaN(expires.getTime()))
            return res.sendErr(status.param_err, "Invalid date");

        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Key.findOneById(req.query.key, function (err, key) {
            if (err) return res.sendErr(status.db_err, err);
            if (!key) return res.sendErr(status.db_err, "Key not found");

            if (!permission.hasKeyCreateAccess(key.permission))
                return res.sendErr(status.permission_err, "Access denied");

            // noinspection JSUnresolvedFunction, JSUnresolvedVariable
            User.findOneById(req.query.account, function (err, account) {
                if (err) return res.sendErr(status.db_err, err);
                if (!account) return res.sendErr(status.db_err, "Account not found");

                Key.create({account: account._id, expires: expires, lock: key.lock}, function (err, key) {
                    if (err) return res.sendErr(status.db_err, err);
                    return res.sendOk({key: key});
                });
            });
        });
    },
    list: function (req, res) {
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Key.findOneById(req.query.key, function (err, key) {
            if (err) return res.sendErr(status.db_err, err);
            if (!key) return res.sendErr(status.db_err, "Key not found");

            // noinspection JSUnresolvedVariable
            Key.list({criteria: {account: key.account}}, function (err, keys) {
                if (err) return res.sendErr(status.db_err, err);
                if (!keys) return res.sendErr(status.db_err, "No keys have been issued");

                res.sendOk({keys: keys});
            });
        });
    },
    edit: function (req, res) {
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Key.findOneById(req.query.key, function (err, key) {
            if (err) return res.sendErr(status.db_err, err);
            if (!key) return res.sendErr(status.db_err, "Key not found");

            if (!permission.hasKeyEditAccess(key.permission))
                return res.sendErr(status.permission_err, "Access denied");

            // noinspection JSUnresolvedVariable
            key.permission = req.query.permission;

            key.save(function (err, key) {
                if (err) return res.sendErr(status.db_err, err);
                return res.sendOk({key: key});
            });
        });
    },
    peers: function (req, res) {
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Key.findOneById(req.query.key, function (err, key) {
            if (err) return res.sendErr(status.db_err, err);
            if (!key) return res.sendErr(status.db_err, "Key not found");

            if (!permission.hasAllPairedKeyAccess(key.permission))
                return res.sendErr(status.permission_err, "Access denied");

            // noinspection JSUnresolvedVariable
            Key.list({criteria: {lock: key.lock}}, function (err, keys) {
                if (err) return res.sendErr(status.db_err, err);
                if (!keys) return res.sendErr(status.db_err, "No keys have been issued");

                res.sendOk({keys: keys});
            });
        });
    },
    remove: function (req, res) {
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Key.findOneById(req.query.key, function (err, key) {
            if (err) return res.sendErr(status.db_err, err);
            if (!key) return res.sendErr(status.db_err, "Key not found");

            // noinspection JSUnresolvedVariable
            if (req.query.key != req.query.peer && !permission.hasKeyRemoveAccess(key.permission))
                return res.sendErr(status.permission_err, "Access denied");

            // noinspection JSUnresolvedVariable
            Key.remove(req.query.peer, function (err, key) {
                if (err) return res.sendErr(status.db_err, err);
                res.sendOk({key: key});
            });
        });
    }
};