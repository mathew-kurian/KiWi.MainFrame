var Account = require('./../../models/account.model.js');
var Token = require('./../../models/token.model.js');
var status = require('./../../constants/status');
var tools = require('./../../libs/tools');

module.exports = {
    create: function (req, res) {
        Account.create(req.query, function (err, account) {
            if (err) return res.sendErr(status.db_err, err);
            res.sendOk({account: account});
        });
    },
    login: function (req, res) {
        var query = {};

        if (req.query.email) query.email = req.query.email;
        if (req.query.username) query.username = req.query.username;
        if (req.query._id) query._id = req.query._id;

        if (Object.keys(query).length === 0 || !req.query.password)
            return res.sendErr(status.param_err, 'No email, username, or _id  and/or password');

        query.password = req.query.password;

        // noinspection JSUnresolvedFunction
        Account.findOne(query, function (err, account) {
            if (err) return res.sendErr(status.db_err, err);
            if (!account) return res.sendErr(status.db_err, "Account not found");

            new Token({
                account: account._id
            }).save(function (err, token) {
                    if (err) return res.sendErr(status.db_err, err);
                    res.sendOk({token: token._id});
                });
        });
    },
    debug: {
        list: function (req, res) {
            Account.list({}, function (err, accounts) {
                if (err)  return res.sendErr(status.db_err, err);
                res.sendOk({accounts: accounts});
            });
        }
    },
    edit: function (req, res) {

        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.fields))
            return res.sendErr(status.param_err, "Invalid field type");

        // noinspection JSUnresolvedFunction
        Account.findById(req.token.account, function (err, account) {
            if (err) return res.sendErr(status.db_err, err);
            if (!account) return res.sendErr(status.db_err, "Account not found");

            var updated = {};
            var save = false;
            var _account = tools.object.clone(account);

            // noinspection JSUnresolvedVariable
            req.query.fields.forEach(function (field) {
                var _value = tools.get(account, field.name);
                updated[field.name] = false;
                // noinspection JSUnresolvedVariable
                if (save |= updated[field.name] = (!field.testAndSet || (field.testAndSet && _value == field._value)))
                    tools.set(account, field.name, field.value, '-f');
            });

            if (!save) return res.sendOk({updated: updated, _account: _account, account: account});

            account.save(function (err) {
                if (err) return res.sendErr(status.db_err, err);
                res.sendOk({updated: updated, _account: _account, account: account});
            });
        });
    }
};