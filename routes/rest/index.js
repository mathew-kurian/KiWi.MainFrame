var express = require('express');
var account = require('./account');
var key = require('./key');
var token = require('./token');
var lock = require('./lock');
var tools = require('./../../libs/tools');
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

router.use(function (req, res, next) {
    // noinspection JSUnresolvedVariable
    if (req.query.clientId === config.defaultClientId)
        return res.sendErr(status.clientId_err, 'Invalid clientId. Request access?');

    next();
});

var isLoggedIn = function (req, res, next) {
    // noinspection JSUnresolvedFunction, JSUnresolvedVariable
    Token.findById(req.query.token, function (err, token) {
        if (err) return res.sendErr(status.db_err, err);
        if (!token) return res.sendErr(status.db_err, 'Token not found. Expired?');
        if (new Date(token.created).getTime() + config.tokenExpirationTime > Date.now()) {
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
router.get('/lock/list', isLoggedIn, lock.list);
router.get('/lock/create', isLoggedIn, lock.create);
router.get('/lock/register', isLoggedIn, lock.register);
router.get('/lock/keys', isLoggedIn, lock.keys);

router.get('/token/debug/list', token.debug.list);
router.get('/key/debug/list', key.debug.list);
router.get('/lock/debug/list', lock.debug.list);
router.get('/account/debug/list', account.debug.list);

module.exports = router;