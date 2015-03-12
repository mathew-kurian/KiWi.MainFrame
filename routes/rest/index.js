var express = require('express');
var account = require('./account');
var codes = require('./../codes');
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
        res.sendJson({
            status: status,
            err: err
        });
    };

    res.sendOk = function (data) {
        res.sendJson({
            status: codes.ok,
            res: data
        });
    };

    next();
});

router.get('/account/create', account.create);
router.get('/account/list', account.list);

module.exports = router;