var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var TokenSchema = new Schema({
    user: {type: ObjectId, required: true},
    created: {type: Date, default: Date.now}
});

TokenSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.created) this.created = now;
    next();
});

TokenSchema.statics.expired = function (_id, cb) {
    this.findOne({
        _id: _id
    }).exec(function (err, token) {
        if (err) {
            console.error(err);
            return cb(false);
        }

        if (token.created + config.tokenExpirationTime < Date.now()) {
            token.created = Date.now();
            token.save(function () {
                if (err) console.error(err);
                cb(true);
            });
        } else {
            this.remove({
                _id: token._id
            }, function (err) {
                if (err) console.error(err);
                cb(false);
            });
        }
    });
};


module.exports = mongoose.model('Event', TokenSchema);
