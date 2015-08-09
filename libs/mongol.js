var tools = require('./tools');
var config = require('./../config');
var extend = require('extend');
var postFind = require('mongoose-post-find');

module.exports.Extend = {
    Timestamp: function (Schema) {
        return extend(function (model) {
            model.created = {type: Date};
            model.updated = {type: Date};

            var schema = Schema(model);

            schema.pre('save', function (next) {
                var now = new Date();
                this.updated = now;
                if (!this.created) this.created = now;
                next();
            });

            return schema;
        }, Schema);
    },
    Private: function (Schema) {
        return extend(function (model, _private) {
            if (!tools.object.is(_private)) return;

            model._private = _private;
            model._private.__k = {type: String, default: "", required: false};

            var schema = Schema(model);

            schema.pre('save', function (next) {
                if (this._private) {
                    if (this._private.__k) {
                        if (this._private.__k != config.private_field_symmetric_key) {
                            delete this._private;
                        }
                        delete this._private.__k;
                    } else {
                        delete this._private;
                    }
                }

                next();
            });

            schema.plugin(postFind, {
                find: function (docs, done) {
                    for (var i = 0; i < docs.length; i++) {
                        var doc = docs[i];
                        if (!doc._private) continue;
                        doc._private = tools.crypto.symmetric.encrypt(JSON.stringify(doc._private),
                            config.private_field_algorithm, config.private_field_symmetric_key);
                    }

                    done(null, docs);
                },
                findOne: function (doc, done) {
                    if (doc._private) doc._private = tools.crypto.symmetric.encrypt(JSON.stringify(doc._private),
                        config.private_field_algorithm, config.private_field_symmetric_key);

                    done(null, doc);
                }
            });

            return schema;
        }, Schema);
    }
};

module.exports.Private = {
    open: function (doc) {
        if (!doc._private) return doc;

        doc._private = JSON.parse(tools.crypto.symmetric.decrypt(String(doc._private).replace(/'/g, ''), config.private_field_algorithm, config.private_field_symmetric_key));

        return doc;
    },
    set: function (doc, path, val) {
        tools.set(doc._private, path, val, '-f');
    },
    get: function (doc, path) {
        return tools.get(doc._private, path);
    },
    del: function (doc, path) {
        return tools.del(doc._private, path);
    },
    flush: function (doc) {
        if (!doc._private) return doc;
        if (!tools.object.is(doc._private)) return doc;

        doc._private.__k = config.private_field_symmetric_key;
    }
};

module.exports.statics = {
    create: function (schema, del) {
        schema.statics.create = function (data, cb) {
            data = tools.object.is(data) ? data : {};
            del = del || [];
            for (var i; i < del.length; i++)
                tools.del(data, del[i]);
            (new this(data)).save(cb);
        }
    },
    list: function (schema) {
        schema.statics.list = function (options, cb) {
            var criteria = options.criteria || {};
            var sort = options.sort || {created: 'descending'};
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
                .exec(cb);
        }
    }
};

module.exports.path = {
    final: function (schema, paths) {
        for (var i = 0; i < paths.length; i++)
            (function (path) {
                schema.path(path).set(function (value) {
                    if (tools.undef(this[path]))
                        this[path] = value;
                });
            })(paths[i]);
    }
};

