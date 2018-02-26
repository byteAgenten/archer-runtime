/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint no-return-assign: 0 guard-for-in: 0 */
var objectProto = Object.prototype;

module.exports = {
    isNumber: function (value) {
        return typeof value == 'number' || (value != null && objectProto.toString.call(value) == '[object Number]');
    },
    isString: function (value) {
        return typeof value == 'string' || (value != null && objectProto.toString.call(value) == '[object String]');
    },
    isFunction: function (value) {
        return typeof value == 'function' || (value != null && objectProto.toString.call(value) == '[object Function]');
    },
    isObject: function (value) {
        return value != null && typeof value == 'object';
    },
    assign: function (target) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {

            if (source) {

                Object.getOwnPropertyNames(source).forEach(function (prop) {

                    var sourceDescriptor = Object.getOwnPropertyDescriptor(source, prop);

                    Object.defineProperty(target, prop, sourceDescriptor);
                });
            }
        });
        return target;
    },
    forEach: function (obj, fn, context) {
        Array.prototype.forEach.call(obj, fn, context);
    },
    forIn: function (obj, fn, context) {
        for (var key in obj) {
            var val = obj[key];
            fn.call(context, val, key);
        }
    },
    find: function (list, fn, context) {
        var matches = list.filter(fn, context);

        return matches.length ? matches[0] : null;
    },
    toArray: function (obj) {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    },
    curry: function (fn) {
        var arity = fn.length;

        return function partial() {
            var args = Array.prototype.slice.call(arguments, 0);
            if (args.length >= arity) {
                return fn.apply(null, args);
            }
            return function curried() {
                var args2 = Array.prototype.slice.call(arguments, 0);
                return partial.apply(null, args.concat(args2));
            };
        };
    },
    memoize: function (fn) {
        var cache = {};
        return function (arg) {
            if (arg in cache) {
                return cache[arg];
            }

            return cache[arg] = fn(arg);
        };
    },
    noop: function () {
    }
};
