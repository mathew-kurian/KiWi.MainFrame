var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../config');

var AccountSchema = Schema({
    name: {
        first: {type: String, trim: true, required: true},
        last: {type: String, trim: true, required: true}
    },
    username: {type: String, lowercase: true, trim: true, required: true, index: {unique: true}},
    email: {
        type: String,
        trim: true,
        required: true,
        index: {unique: true},
        validate: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    },
    mobile: {type: Number, validate: /^\d{10}$/},
    photo: {
        type: String,
        default: config.defaultProfilePicture,
        validate: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
    },
    created: {type: Date},
    updated: {type: Date},
    password: {type: String, required: true}
});

AccountSchema.pre('save', function (next) {
    var now = new Date();
    this.updated = now;
    if (!this.created) this.created = now;
    next();
});

AccountSchema.statics.list = function (options, cb) {
    var criteria = options.criteria || {};
    var sort = options.sort || {createdAt: -1};
    var limit = options.limit === 0 ? 0 : (options.limit || 10);
    var page = options.page || 0;
    var populate = options.populate || [];
    var select = options.select || '';

    this.find(criteria)
        .select(select)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .skip(limit * page)
        .exec(cb)
};

AccountSchema.methods.login = function (options, cb) {
    var query = {};

    if (options.email) query.email = options.email;
    if (options.username) query.username = options.username;
    if (options._id) query._id = options._id;

    this.findOne(options)
        .exec(function () {

        });
};

module.exports = mongoose.model('Account', AccountSchema);