var mongoose = require('mongoose');
var tools = require('./../libs/tools');
var statics = require('./../libs/mongoose-statics');
var Schema = mongoose.Schema;

var LockSchema = Schema({
    serial: {type: String, required: true},
    name: {type: String, default: "Untitled", trim: true},
    location: {type: {type: String, required: true, default: [Number.MAX_VALUE, Number.MAX_VALUE]}, coordinates: []},
    locked: {type: Boolean, default: false, required: true},
    enabled: {type: Boolean, default: true, required: true},
    battery: {type: Number, default: 0},
    created: {type: Date},
    updated: {type: Date},
    registered: {type: Boolean, default: false}
}, {strict: true});

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
