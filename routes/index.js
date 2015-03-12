var express = require('express');
var rest = require('./rest');
var router = express.Router();

router.use("/rest", rest);

module.exports = router;