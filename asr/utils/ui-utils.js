var $ = require('jquery');
var tools = require('./../../libs/tools');

module.exports = {
    calcLightClasses: function (lock) {
        var lightCls = "light";

        if (lock) {
            switch (lock.powerState) {
                default:
                case 0:
                    lightCls += " red";
                    break;
                case 1:
                    lightCls += " green";
                    break;
                case 2:
                    lightCls += " blue";
                    break;
            }

            if (lock.alert) {
                lightCls += " on";
            }
        }

        return lightCls;
    },
    checkJoin: function (pre, actual, expect, res, post) {
        return (pre || "") + (actual == expect ? res : "") + (post || "");
    },
    findObjectById: function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
            var elem = arr[i];
            if (elem._id == id) {
                return elem;
            }
        }
    },
    validate: function (context, key, opts) {
        return function (e) {
            var value = e.target.value;
            var target = this.getDOMNode();

            if (opts && ((typeof opts.validate === "function" && !opts.validate(value || "")) ||
                (opts.validate && !("" || value).match(opts.validate)))) {
                return $(target).addClass('err');
            }

            $(target).removeClass('err');

            var obj = {};
            tools.set(obj, key, value, "-f");
            context.setState(obj);

            if (opts.change) opts.change();
        }
    },
    logEvent: function () {
        var typeString = Function.prototype.call.bind(Object.prototype.toString)
        console.log.apply(console, Array.prototype.map.call(arguments, function (x) {
            switch (typeString(x).slice(8, -1)) {
                case 'Number':
                case 'String':
                case 'Undefined':
                case 'Null':
                case 'Boolean':
                    return x;
                case 'Array':
                    return x.slice();
                default:
                    var out = Object.create(Object.getPrototypeOf(x));
                    out.constructor = x.constructor;
                    for (var key in x) {
                        out[key] = x[key];
                    }
                    Object.defineProperty(out, 'constructor', {value: x.constructor});
                    return out;
            }
        }));
    }
};