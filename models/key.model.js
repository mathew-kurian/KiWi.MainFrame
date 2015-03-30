var mongoose = require('mongoose');
var tools = require('./../libs/tools');
var permission = require('./../constants/permission');
var util = require('util');
var Mongol = require('./../libs/mongol.js');
var Schema = Mongol.Extend.Timestamp(mongoose.Schema);

var KeySchema = Schema({
    account: {type: Schema.Types.ObjectId, required: true},
    lock: {type: Schema.Types.ObjectId, required: true},
    permission: {
        type: Number,
        validate: tools.regex.parse(util.format('/[%d-%d]/g', permission.highest, permission.lowest)),
        default: permission.lowest,
        required: true
    },
    expiration: {type: Date, default: new Date(8640000000000000), required: true}
});

Mongol.path.final(KeySchema, ['lock', 'account']);
Mongol.statics.list(KeySchema);
Mongol.statics.create(KeySchema, ['permission']);

KeySchema.index({account: 1, lock: 1}, {unique: true});

module.exports = mongoose.model('Key', KeySchema);
