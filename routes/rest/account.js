var Account = require('./../../models/account.model.js');
var codes = require('./../codes');

module.exports = {
    create: function (req, res) {
        new Account(req.query).save(function (err, account) {
            if (err) return res.sendErr(codes.db_err, err);
            res.sendOk({
                account : account
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
    }
};