var Key = require('./../../models/key.model');
var Lock = require('./../../models/lock.model');
var Event = require('./../../models/event.model');
var status = require('./../../constants/status');
var sockets = require('./../../sockets');
var event = require('./../../constants/event');
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

                Lock.findById(key.lock, function (err, lock) {
                    if (err) return res.sendErr(status.db_err, err);
                    if (!lock) return res.sendErr(status.db_err, "Lock not found");

                    Key.create({account: account._id, expires: expires, lock: key.lock}, function (err, key) {
                        if (err) return res.sendErr(status.db_err, err);

                        Event.create({
                            lock: key.lock,
                            event: event.key_created,
                            accountSrc: req.token.account,
                            accountDest: account._id
                        }, function (err, event) {
                            if (err) return;

                            Key.list({criteria: key.lock}, function (err, keys) {
                                if (err) return res.sendErr(status.db_err, err);

                                res.sendOk({key: key});

                                (keys || []).forEach(function (paired_key) {
                                    if (paired_key._id == req.query.key) return;
                                    if (!permission.hasAllPairedKeyAccess(paired_key.permission)) return;
                                    sockets.Account.emit(paired_key.account, event.key_created, {key: key, lock: lock});
                                    sockets.Account.emit(paired_key.account, event.new_event, event);
                                });
                            });
                        });
                    });
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

        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.fields))
            return res.sendErr(status.param_err, "Invalid field type");

        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Key.findOneById(req.query.key, function (err, key) {
            if (err) return res.sendErr(status.db_err, err);
            if (!key) return res.sendErr(status.db_err, "Key not found");

            if (!permission.hasKeyEditAccess(key.permission))
                return res.sendErr(status.permission_err, "Access denied");

            // noinspection JSUnresolvedVariable
            Key.findOne({_id: req.query.edit_key, lock: key.lock}, function (err, edit_key) {
                if (err) return res.sendErr(status.db_err, err);
                if (!edit_key) return res.sendErr(status.db_err, "Edit key not found");

                Key.list({criteria: {permission: permission.owner, lock: key.lock}}, function (err, keys) {
                    if (err) return res.sendErr(status.db_err, err);
                    keys = keys || [];

                    // ensure owner doesn't demote themselves if there is only 1 owner left
                    if (keys.length == 1)
                        req.query.fields.push({name: 'permission', value: permission.owner});

                    // noinspection JSUnresolvedVariable
                    var merge_res = tools.merge(edit_key, req.query.fields, 'key');

                    if (!merge_res.save) return res.sendOk(merge_res);

                    Event.create({
                        lock: key.lock,
                        event: event.key_edit,
                        accountSrc: req.token.account,
                        accountDest: edit_key.account
                    }, function (err, event) {
                        if (err) return;

                        edit_key.save(function (err, key) {
                            if (err) return res.sendErr(status.db_err, err);

                            Key.list({criteria: key.lock}, function (err, keys) {
                                if (err) return res.sendErr(status.db_err, err);

                                res.sendOk(merge_res);

                                (keys || []).forEach(function (paired_key) {
                                    if (paired_key._id == req.query.key) return;
                                    if (!permission.hasAllPairedKeyAccess(paired_key.permission)) return;
                                    sockets.Account.emit(paired_key.account, event.key_edit, {key: key, lock: lock});
                                    sockets.Account.emit(paired_key.account, event.new_event, event);
                                });
                            });
                        });
                    });
                });
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
            if (req.query.key != req.query.remove_key && !permission.hasKeyRemoveAccess(key.permission))
                return res.sendErr(status.permission_err, "Access denied");

            Key.list({criteria: {permission: permission.owner, lock: key.lock}}, function (err, keys) {
                if (err) return res.sendErr(status.db_err, err);
                keys = keys || [];

                // ensure owner can't remove themselves
                if (keys.length == 1) return res.sendErr(status.last_owner_err, err);

                // noinspection JSUnresolvedVariable
                Key.remove(req.query.remove_key, function (err, key) {
                    if (err) return res.sendErr(status.db_err, err);
                    res.sendOk({key: key});

                    Lock.findById(key.lock, function (err, lock) {
                        if (err) return res.sendErr(status.db_err, err);
                        if (!lock) return res.sendErr(status.db_err, "Lock not found");

                        Event.create({
                            lock: key.lock,
                            event: event.key_remove,
                            accountSrc: req.token.account,
                            accountDest: key.account
                        }, function (err, event) {
                            if (err) return;

                            Key.list({criteria: key.lock}, function (err, keys) {
                                if (err) return res.sendErr(status.db_err, err);

                                res.sendOk({key: key});

                                var dest = keys || [];
                                dest.push(key.account);
                                dest.forEach(function (paired_key) {
                                    if (paired_key._id == req.query.key) return;
                                    if (!permission.hasAllPairedKeyAccess(paired_key.permission)) return;
                                    sockets.Account.emit(paired_key.account, event.key_remove, {key: key, lock: lock});
                                    sockets.Account.emit(paired_key.account, event.new_event, event);
                                });
                            });
                        });
                    });
                });
            });
        });
    }
};