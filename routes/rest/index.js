var express = require('express');
var account = require('./account');
var key = require('./key');
var socket = require('./socket');
var token = require('./token');
var lock = require('./lock');
var config = require('./../../config');
var status = require('./../../constants/status');
var Token = require('./../../models/token.model');

var router = express.Router();

router.use(function (req, res, next) {

    res.sendJson = function (status, msg, data) {
        res.header('Content-Type', 'application/json');
        res.json({status: status, msg: msg, data: data});
    };

    res.sendErr = function (status, msg) {
        res.sendJson(status, msg);
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

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});

var isLoggedIn = function (req, res, next) {
    if (req.query.action === 'lock') return next();

    // noinspection JSUnresolvedFunction, JSUnresolvedVariable
    Token.findById(req.query.token, function (err, token) {
        if (err) return res.sendErr(status.db_err, err);
        if (!token) return res.sendErr(status.db_err, 'Token not found. Expired?');
        if (new Date(token.updated).getTime() + config.token_expiration_time > Date.now()) {
            // automatically set the updated Date field
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
router.get('/account/info', account.info);
router.get('/account/edit', isLoggedIn, account.edit);
router.get('/account/debug/list', account.debug.list);

router.get('/lock/list', isLoggedIn, lock.list);
router.get('/lock/create', isLoggedIn, lock.create);
router.get('/lock/edit', isLoggedIn, lock.edit);
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