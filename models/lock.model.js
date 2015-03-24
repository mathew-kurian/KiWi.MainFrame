var mongoose = require('mongoose');
var tools = require('./../libs/tools');
var Mongol = require('./../libs/mongol.js');
var config = require('./../config');
var Schema = Mongol.Extend.Private(Mongol.Extend.Timestamp(mongoose.Schema));

var LockSchema = Schema({
    serial: {type: String, required: true, index: {unique: true}},
    name: {type: String, default: config.default_lock_name, trim: true}
}, {
    location: {
        type: {type: String, default: 'Point', required: 'true'},
        coordinates: {type: Array, default: [0, 0], required: true}
    },
    locked: {type: Boolean, default: false, required: true},
    enabled: {type: Boolean, default: true, required: true},
    battery: {type: Number, default: 0},
    registered: {type: Boolean, default: false}
});

Mongol.statics.list(LockSchema);
Mongol.statics.create(LockSchema, ['location']);

LockSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Lock', LockSchema);
