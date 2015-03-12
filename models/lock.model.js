var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var Schema = mongoose.Schema;

var LockSchema = Schema({
    _sid: {type: ShortId, len: 5, alphabet: 'abcdefghijklmnopqrtsuvwxyz123456789'},
    name: {type: String, default: "Untitled", trim: true},
    location: {type: {type: String}, coordinates: []},
    locked: {type: Boolean, default: false},
    enabled: {type: Boolean, default: true},
    battery: {type: Number, default: 0},
    created: {type: Number},
    updated: {type: Number}
}, {strict: true});

LockSchema.index({location: '2dsphere'});

LockSchema.pre('save', function (next) {
    var now = new Date();
    this.updated = now;
    if (!this.created) this.created = now;
    next();
});

module.exports = mongoose.model('Lock', LockSchema);
