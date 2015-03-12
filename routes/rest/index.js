var express = require('express');
var account = require('./account');
var token = require('./token');
var codes = require('./../../libs/codes');
var router = express.Router();

router.use(function (req, res, next) {

    res.sendJson = function (status, err, data) {
        res.header('Content-Type', 'application/json');
        res.json({
            status: status,
            err: err,
            data : data
        });
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
router.get('/account/list', account.list);
router.get('/account/login', account.login);
router.get('/account/edit', account.edit);

router.get('/token/list', token.list);

module.exports = router;