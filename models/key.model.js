var mongoose = require('mongoose');
var tools = require('./../libs/tools');
var statics = require('./../libs/mongoose-statics');
var Schema = mongoose.Schema;

var KeySchema = Schema({
    account: {type: Schema.Types.ObjectId, required: true},
    lock: {type: Schema.Types.ObjectId, required: true},
    permission: {type: Number, validate: /[0-4]/g, default: 0, required: true},
    created: {type: Date},
    updated: {type: Date}
}, {strict: true});

KeySchema.index({location: '2dsphere'});

KeySchema.pre('save', function (next) {
    var now = new Date();
    this.updated = now;
    if (!this.created) this.created = now;
    next();
});

KeySchema.statics.list = statics.list;

KeySchema.statics.create = function addItem(data, cb) {
    data = tools.object.is(data) ? data : {};
    delete data.permission;
    (new this(data)).save(cb);
};

module.exports = mongoose.model('Key', KeySchema);
