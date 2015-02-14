var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: {
        first: {type: String, trim: true},
        last: {type: String, trim: true}
    },
    username: {type: String, lowercase: true, trim: true},
    mobile: {number: String, uuid: String},
    photo: {data: Buffer, contentType: String},
    created: {type: Number, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);
