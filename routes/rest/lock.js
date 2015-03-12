var Lock = require('./../../models/lock.model.js');
var Token = require('./../../models/token.model.js');
var codes = require('./../../libs/codes');
var tools = require('./../../libs/tools');
var config = require('./../../config');

module.exports = {
    list: function (req, res) {
        Lock.list({}, function (err, tokens) {
            if (err)  return res.sendErr(codes.db_err, err);
            res.sendOk({tokens: tokens});
        });
    },
    create: function (req, res) {
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        Token.validate(req.query.token, function (err, account) {
            if (err) return res.sendErr(codes.token_err, err);
            Lock.create({serial: req.query.serial}).save(function (err, lock) {
                if (err) return res.sendErr(codes.db_err, err);
                res.sendOk({lock: lock});
            });
        });
    },
    register: function (req, res) {

        // noinspection JSUnresolvedVariable
        if (!Array.isArray(req.query.location) || req.query.location.length !== 2)
            return res.sendErr(codes.param_err, "Invalid location");

        var decipher = crypto.createDecipher(config.registrationAlgorithm, config.registrationPassword);
        var dec = decipher.update(text, 'hex', 'utf8');

        if (config.registrationPassword !== (dec + decipher.final('utf8')))
            return res.sendErr(codes.key_err, "Encryption key invalid")

        // noinspection JSUnresolvedFunction
        Lock.findOne({serial: req.query.serial}, function (err, lock) {
            lock.registered = true;
            lock.location = req.query.location;
            lock.save(function (err) {
                if (err) return res.sendErr(codes.db_err, err);
                res.sendOk({info: "registered"});
            });
        });

    }
};