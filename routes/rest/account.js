var Account = require('./../../models/account.model');
var sockets = require('./../../sockets');
var event = require('./../../constants/event');
var Token = require('./../../models/token.model');
var status = require('./../../constants/status');
var tools = require('./../../libs/tools');

module.exports = {
    debug: {
        list: function (req, res) {
            Account.list({}, function (err, accounts) {
                if (err)  return res.sendErr(status.db_err, err);
                res.sendOk({accounts: accounts});
            });
        }
    },
    create: function (req, res) {
        Account.create(req.query, function (err, account) {
            if (err) return res.sendErr(status.db_err, err);
            res.sendOk({account: account});
            Account.count({}, function (err, c) {
                if (err) return;
                sockets.Account.emit('*', event.account_created, {count: c});
            });
        });
    },
    info: function (req, res) {
        var _account = req.query.account || req.token.account;
        Account.findById(_account, function (err, account) {
            if (err) return res.sendErr(status.db_err, err);
            delete account.password;
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

            new Token({account: account._id}).save(function (err, token) {
                if (err) return res.sendErr(status.db_err, err);
                delete account.password;
                res.sendOk({token: token._id, account: account});
                sockets.Account.emit(account, event.account_login, undefined, "Login detected");
            });
        });
    },
    edit: function (req, res) {
        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.fields))
            return res.sendErr(status.param_err, "Invalid field type");

        // noinspection JSUnresolvedFunction
        Account.findById(req.token.account, function (err, account) {
            if (err) return res.sendErr(status.db_err, err);
            if (!account) return res.sendErr(status.db_err, "Account not found");

            var merge_res = tools.merge(account, req.query.fields, 'account');

            if (!merge_res.save) return res.sendOk(merge_res);

            account.save(function (err) {
                if (err) return res.sendErr(status.db_err, err);
                res.sendOk(merge_res);
                sockets.Account.emit(req.token.account, event.account_model_update, merge_res);
            });
        });
    }
};