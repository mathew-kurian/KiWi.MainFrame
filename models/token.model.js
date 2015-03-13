var mongoose = require('mongoose');
var config = require('./../config');
var Mongol = require('./../libs/mongol.js');
var Schema = Mongol.Extend.Timestamp(mongoose.Schema);

var TokenSchema = Schema({
    account: {type: Schema.Types.ObjectId, required: true}
});

Mongol.statics.list(TokenSchema);

module.exports = mongoose.model('Event', TokenSchema);
