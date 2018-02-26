/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');

function Transformable() {
} // Named prototype for debugging

/**
 * Creates a Transformable that manages a list of transform functions for a dom element and can execute the functions
 * in a prioritized order
 * @param proxy The proxy for the dom element
 * @returns {Transformable}
 */
function transformable(proxy) {

    var instance = new Transformable();

    var entries = [];

    function transform(fn, prio) {

        var newEntry = Entry(fn, prio);

        entries.push(newEntry);

        return remover(newEntry);
    }

    function Entry(fn, priority) {
        return {
            priority: priority || 0,
            apply: function () {
                fn.call(null, proxy);
            }
        };
    }

    function remover(entry) {
        return function removeTransform() {
            var index = entries.indexOf(entry);
            if (index >= 0) entries.splice(index, 1);
        };
    }

    function apply() {

        prioritize();
        entries.forEach(function (entry) {
            entry.apply();
        });
    }

    function clear() {
        entries = [];
    }

    function prioritize() {
        entries.sort(function (left, right) {
            return right.priority - left.priority;
        }); // Desc
    }

    // API
    _.assign(instance, {
        transform: transform,
        clear: clear,
        apply: apply
    });

    return instance;
}

module.exports = transformable;
