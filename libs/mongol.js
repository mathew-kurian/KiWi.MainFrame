var tools = require('./tools');
var extend = require('extend');

module.exports.Extend = {
    Timestamp: function (Schema) {
        return extend(function(model) {
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

