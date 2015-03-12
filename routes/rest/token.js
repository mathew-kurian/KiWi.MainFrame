var Token = require('./../../models/token.model.js');
var status = require('./../../constants/status');

module.exports = {
    debug : {
        list: function (req, res) {
            Token.list({}, function (err, tokens) {
                if (err)  return res.sendErr(status.db_err, err);
                res.sendOk({tokens: tokens});
            });
        }
    }
};