var Key = require('./../../models/key.model.js');
var status = require('./../../constants/status');

module.exports = {
    debug : {
        list: function (req, res) {
            Key.list({}, function (err, keys) {
                if (err)  return res.sendErr(status.db_err, err);
                res.sendOk({keys: keys});
            });
        }
    },
    edit : function(req, res){
        Key.findOneById(req.query.key, function(err, key){

        });
    },
    remove : function(req, res){

    }
};