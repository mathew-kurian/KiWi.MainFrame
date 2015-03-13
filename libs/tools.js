module.exports.undef = function (a) {
    return typeof a === "undefined" || a == null;
};


module.exports.object = {
    clone: function (obj) {
        obj = typeof obj === 'object' ? obj : {};
        return JSON.parse(JSON.stringify(obj));
    },
    is: function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] !== "object") {
                return false;
            } else if (Array.isArray(arguments[i])) {
                return false;
            }
        }

        return true;
    }
};

module.exports.regex = {
    parse: function (val) {
        val = ((val = val || "") ? val.toString() : undefined) || "";
        var mr = (val.match(/^\/(.*?)\/([gim]*)$/) || []);
        mr.shift();
        return RegExp.apply(this, mr || val);
    },
    is: function (val) {
        val = ((val = val || "") ? val.toString() : undefined) || "";
        var mr = exports.array.trim(val.match(/^\/(.*?)\/([gim]*)$/) || []);
        mr.shift();
        return mr.length > 0;
    }
};

module.exports.array = {
    contains: function (arr, a) {
        if (!Array.isArray(arr)) {
            return false;
        }

        var i;

        if (exports.regex.is(a)) {
            for (i = 0; i < arr.length; i++) {
                if (arr[i].toString().match(a)) {
                    return true;
                }
            }

            return false;
        }

        for (i = 0; i < arr.length; i++) {
            if (arr[i] === a) {
                return true;
            }
        }

        return false;
    },
    trim: function (arr) {
        if (!Array.isArray(arr)) {
            return [];
        }

        for (var i = 0; i < arr.length; i++) {
            if (exports.undef(arr[i]) || exports.empty(arr[i])) {
                arr.splice(i--, 1);
            }
        }

        return arr;
    }
};

exports.auto = function (a) {
    if (!isNaN(a)) {
        return Number(a);
    } else if (!isNaN(Date.parse(a))) {
        return new Date(Date.parse(a));
    }

    try {
        return JSON.parse(a);
    } catch (e) {
        // README ignore
    }

    try {
        /*jslint evil: true */
        var c;
        eval('c=' + a.toString());
        return c;
    } catch (e) {
        // README ignore
    }

    return a;
};

// FIXME Add support for index of array!!!!
var _f = ["-s", "-n", "-f", "-d"];

// README:
// -d: Delete Key/Set
// -f: Create Key/Set Value
// -s: Create Key/Set Value IFF Value != null/undefined
// -n: Create Key/Set Value IFF Key == null/undefined
module.exports.set = function (obj, a, b, f) {
    var _bobj = obj;
    if (arguments.length === 3 && b === '-d') f = b;
    f = exports.array.contains(_f, f) ? f : '-n';
    if (exports.undef(a)) return _bobj;
    a = a.split(/[>|\.]/g);
    while (a.length) {
        var key = a.shift();
        if (exports.undef(obj[key]) && f === "-d") {
            return;
        } else if ((exports.undef(obj[key]) || (f && (typeof obj[key] !== 'object' || Array.isArray(obj[key])))) && a.length > 0) {
            obj[key] = {};
            obj = obj[key];
        } else if (a.length === 0) {
            var _key = key.substring(0, key.length - 1);
            var plus = key.substring(key.length - 1) === "+";
            if (f === "-d") {
                delete obj[key];
                return _bobj;
            } else if (plus && Array.isArray(obj[_key])) {
                obj[_key].push(b);
                return _bobj;
            } else if (exports.undef(obj[key]) || (f === '-s' && !exports.undef(b)) || f === '-f') {
                if (plus) {
                    obj[_key] = !b ? [] : [b];
                    return _bobj;
                }

                obj[key] = b;
                return _bobj;
            }
            return _bobj;
        } else {
            obj = obj[key];
        }
    }

    return _bobj;
};

module.exports.del = function (obj, a) {
    return module.exports.set(obj, a, '-d');
};

module.exports.get = function (obj, a, b) {

    if (exports.undef(a)) {
        return b;
    }

    a = a.split(/[>|\.]/g);

    while (a.length) {

        var key = a.shift();
        var index = key.match(/\[([0-9]*?)\]/g);

        if (!exports.undef(index)) {
            key = key.replace(index, '');
            index = parseInt(index[0].replace(/[\[\]]/g, ''));

            if (!Array.isArray(obj[key]) || exports.undef(index)) {
                return b;
            }

            obj = obj[key];
            key = index;
        }

        if (exports.undef(obj[key])) {
            return b;
        }

        if (a.length === 0) {
            return obj[key];
        }

        obj = obj[key];
    }

    return b;
};