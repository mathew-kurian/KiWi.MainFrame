var express = require('express');
var account = require('./account');
var key = require('./key');
var socket = require('./socket');
var token = require('./token');
var lock = require('./lock');
var config = require('./../../config');
var status = require('./../../constants/status');
var Token = require('./../../models/token.model.js');

var router = express.Router();

router.use(function (req, res, next) {

    res.sendJson = function (status, err, data) {
        res.header('Content-Type', 'application/json');
        res.json({status: status, err: err, data: data});
    };

    res.sendErr = function (status, err) {
        res.sendJson(status, err);
    };

    res.sendOk = function (data) {
        res.sendJson(status.ok, undefined, data);
    };

    next();
});

if (config.default_client_id) {
    router.use(function (req, res, next) {
        // noinspection JSUnresolvedVariable
        if (req.query.client_id !== config.default_client_id)
            return res.sendErr(status.client_id_err, 'Invalid clientId. Request access from developer?');

        next();
    });
}

var isLoggedIn = function (req, res, next) {
    // noinspection JSUnresolvedFunction, JSUnresolvedVariable
    Token.findById(req.query.token, function (err, token) {
        if (err) return res.sendErr(status.db_err, err);
        if (!token) return res.sendErr(status.db_err, 'Token not found. Expired?');
        if (new Date(token.created).getTime() + config.token_expiration_time > Date.now()) {
            token.created = Date.now();
            token.save(function () {
                if (err) res.sendErr(status.db_err, err);
                req.token = token.toObject();
                next();
            });
        } else {
            token.remove(function () {
                res.sendErr(status.token_err, 'Token expired');
            });
        }
    });
};

router.get('/account/create', account.create);
router.get('/account/login', account.login);
router.get('/account/edit', isLoggedIn, account.edit);
router.get('/account/debug/list', account.debug.list);

router.get('/lock/list', isLoggedIn, lock.list);
router.get('/lock/create', isLoggedIn, lock.create);
router.get('/lock/register', isLoggedIn, lock.register);
router.get('/lock/debug/list', lock.debug.list);

router.get('/keys/create', isLoggedIn, key.create);
router.get('/keys/edit', isLoggedIn, key.edit);
router.get('/keys/remove', isLoggedIn, key.remove);
router.get('/keys/list', isLoggedIn, key.list);
router.get('/keys/peers', isLoggedIn, key.peers);
router.get('/key/debug/list', key.debug.list);

router.get('/socket/open', isLoggedIn, socket.open);
router.get('/socket/close', isLoggedIn, socket.close);
router.get('/socket/debug/dashboard', isLoggedIn, socket.debug.dashboard);
router.get('/socket/debug/emit', isLoggedIn, socket.debug.emit);

router.get('/token/debug/list', token.debug.list);

module.exports = router;