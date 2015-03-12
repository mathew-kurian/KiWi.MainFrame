var Account = require('./../../models/account.model.js');
var Token = require('./../../models/token.model.js');
var codes = require('./../../libs/codes');
var tools = require('./../../libs/tools');

module.exports = {
    create: function (req, res) {
        new Account(req.query).save(function (err, account) {
            if (err) return res.sendErr(codes.db_err, err);
            res.sendOk({
                account: account
            });
        });
    },
    list: function (req, res) {
        Account.list({}, function (err, accounts) {
            if (err)  return res.sendErr(codes.db_err, err);
            res.sendOk({
                accounts: accounts
            });
        });
    },
    login: function (req, res) {
        Account.login(req.query, function (err, token) {
            if (err)  return res.sendErr(codes.db_err, err);
            res.sendOk({
                token: token
            });
        });
    },
    edit: function (req, res) {
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Token.validate(req.query.token, function (err, account) {
            if (err) return res.sendErr(codes.token_err, err);

            // noinspection JSUnresolvedVariable
            Account.findById(account, function (err, account) {

                if (err) return res.sendErr(codes.db_err, err);
                if (!account) return res.sendErr(codes.db_err, "Account not found");

                // noinspection JSUnresolvedVariable
                var fields = Array.isArray(req.query.fields) ? req.query.fields : [];
                var updated = [];
                var _account = tools.object.clone(account);

                fields.forEach(function (field, i) {
                    // noinspection JSUnresolvedVariable
                    if (updated[i] = (!field.testAndSet || (field.testAndSet && tools.get(account, field.name) == field._value)))
                        tools.set(account, field.name, field.value, '-f');
                    else updated[i] = false;
                });

                account.save(function (err) {
                    if (err) return res.sendErr(codes.db_err, err);
                    res.sendOk({
                        updated: updated,
                        _account : _account,
                        account : account
                    });
                });
            });
        });
    }
};