var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = Schema({
    lock: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    text: {type: String, trim: true},
    created: {type: Number, default: Date.now}
}, {strict: true});

EventSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.created) this.created = now;
    next();
});

module.exports = mongoose.model('Event', EventSchema);
