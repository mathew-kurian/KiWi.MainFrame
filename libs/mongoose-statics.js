module.exports.list = function (options, cb) {
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
};