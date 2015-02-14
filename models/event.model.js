var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = Schema({
    lock: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    text: {type: String, trim: true},
    created: {type: Number, default: Date.now}
});

module.exports = mongoose.model('Event', EventSchema);
