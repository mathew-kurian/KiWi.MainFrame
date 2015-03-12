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

module.exports = mongoose.model('Event', TokenSchema);
