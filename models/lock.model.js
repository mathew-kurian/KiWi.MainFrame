var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var Schema = mongoose.Schema;

var LockSchema = Schema({
    owner: Schema.Types.ObjectId,
    shortId : { type: ShortId, len: 5, alphabet: 'abcdefghijklmnopqrtsuvwxyz123456789' },
    name : { type : String, default : "Untitled", trim : true },
    location : { x : Number, y : Number },
    pairedUsers : [ Schema.Types.ObjectId ],
    pairedTime : Date,
    battery : { type: Number, default: 0 }, 
    created: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Lock', LockSchema);
