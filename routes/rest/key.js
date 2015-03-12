var Key = require('./../../models/key.model.js');
var codes = require('./../../libs/codes');

module.exports = {
    list: function (req, res) {
        Key.list({}, function (err, tokens) {
            if (err)  return res.sendErr(codes.db_err, err);
            res.sendOk({tokens: tokens});
        });
    }
};