var mongoose = require('mongoose');
var Mongol = require('./../libs/mongol.js');
var Schema = Mongol.Extend.Timestamp(mongoose.Schema);

var EventSchema = Schema({
    lock: Schema.Types.ObjectId,
    accountSrc: Schema.Types.ObjectId,
    accountDest: Schema.Types.ObjectId,
    text: {type: String, trim: true}
});

Mongol.statics.list(EventSchema);
Mongol.statics.create(EventSchema);

module.exports = mongoose.model('Event', EventSchema);
