var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var Schema = mongoose.Schema;

var LockSchema = Schema({
    owner: Schema.Types.ObjectId,
    _sid: {type: ShortId, len: 5, alphabet: 'abcdefghijklmnopqrtsuvwxyz123456789'},
    name: {type: String, default: "Untitled", trim: true},
    location: {lat: Number, long: Number},
    pairedUsers: [Schema.Types.ObjectId],
    pairedTime: Date,
    battery: {type: Number, default: 0},
    created: {type: Number, default: Date.now}
});

module.exports = mongoose.model('Lock', LockSchema);
