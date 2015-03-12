var express = require('express');
var account = require('./account');
var key = require('./key');
var token = require('./token');
var lock = require('./lock');
var codes = require('./../../libs/codes');
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
        res.sendJson(codes.ok, undefined, data);
    };

    next();
});

router.get('/account/create', account.create);
router.get('/account/login', account.login);
router.get('/account/edit', account.edit);
router.get('/account/debug/list', account.list);

router.get('/token/debug/list', token.list);

router.get('/key/debug/list', key.list);

router.get('/lock/create', lock.create);
router.get('/lock/register', lock.register);
router.get('/lock/debug/list', lock.list);

module.exports = router;