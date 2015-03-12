var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');
var statics = require('./../libs/mongoose-statics');

var TokenSchema = new Schema({
    account: {type: Schema.Types.ObjectId, required: true},
    created: {type: Date, default: Date.now}
});

TokenSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.created) this.created = now;
    next();
});

TokenSchema.statics.list = statics.list;

TokenSchema.statics.validate = function (_id, cb) {
    this.findById(_id).exec(function (err, token) {
        if (err) return cb(err);
        if (!token) return cb("Token not found. Expired?");
        if (new Date(token.created).getTime() + config.tokenExpirationTime > Date.now()) {
            token.created = Date.now();
            token.save(function () {
                if (err) return cb(err);
                cb(undefined, token.account);
            });
        } else {
            token.remove(function () {
                return cb("Token expired");
            });
        }
    });
};


module.exports = mongoose.model('Event', TokenSchema);
