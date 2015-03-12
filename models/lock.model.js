var mongoose = require('mongoose');
var tools = require('./../libs/tools');
var statics = require('./../libs/mongoose-statics');
var config = require('./../config');
var Schema = mongoose.Schema;

var LockSchema = Schema({
    serial: {type: String, required: true, index: {unique: true}},
    name: {type: String, default: config.defaultLockName, trim: true},
    location: {
        type: {type: String, default: 'Point', required: 'true'},
        coordinates: {type: Array, default: [0, 0], required: true}
    },
    locked: {type: Boolean, default: false, required: true},
    enabled: {type: Boolean, default: true, required: true},
    battery: {type: Number, default: 0},
    created: {type: Date},
    updated: {type: Date},
    registered: {type: Boolean, default: false}
});

LockSchema.index({location: '2dsphere'});

LockSchema.pre('save', function (next) {
    var now = new Date();
    this.updated = now;
    if (!this.created) this.created = now;
    next();
});

LockSchema.statics.list = statics.list;

LockSchema.statics.create = function addItem(data, cb) {
    data = tools.object.is(data) ? data : {};
    (new this(data)).save(cb);
};

module.exports = mongoose.model('Lock', LockSchema);
