/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var accessor = require('iag/client/runtime/element/accessor');

function Proxy() {
} // Named prototype for debugging

/**
 * Creates a proxy for a dom element that encapsulates access to the element and allows for deferring attribute changes
 * - Provide access to attribute values of an element
 *      - Unmodified / pristine values that were defined in the SVG source
 *      - Modified values from current animation frame
 * - Defer DOM modifications until apply is called (e.g. apply all changes in next animation frame)
 * @param domElement
 * @param document
 * @returns {Proxy}
 */
function proxy(domElement, document) {

    var instance = new Proxy();

    // Unmodified attribute values
    var pristineValues = {};

    // Scheduled attribute modifications
    // Make modified values inherit pristine values, so if there is no modification we reset to pristine value
    var modifiedValues = Object.create(pristineValues);

    // Accessor factory that binds params to our element/document and caches results
    var elementAccessor = _.memoize(_.curry(accessor)(domElement, document));

    function getDefaultValue(attribute) {
        // Return cached pristine value or get from attribute accessor
        return pristineValues[attribute] || (pristineValues[attribute] = elementAccessor(attribute).get());
    }

    function getDefaultValues(attributes) {
        var values = {};
        attributes.forEach(function (attribute) {
            values[attribute] = getDefaultValue(attribute);
        });
        return values;
    }

    function getValue(attribute) {
        // Return previously modified value or pristine value
        return modifiedValues[attribute] || getDefaultValue(attribute);
    }

    function getValues(attributes) {
        var values = {};
        attributes.forEach(function (attribute) {
            values[attribute] = getValue(attribute);
        });
        return values;
    }

    function setValue(attribute, value) {

        // Make sure pristine value is saved
        getDefaultValue(attribute);

        modifiedValues[attribute] = value;
    }

    function apply() {
        // Apply modifications or reset to pristine value, remove modifications afterwards
        _.forIn(modifiedValues, function (value, attribute) {
            elementAccessor(attribute).set(value);
        });
        clear();
    }

    function clear() {
        // Remove modifications
        modifiedValues = Object.create(pristineValues);
    }

    // API
    _.assign(instance, {
        getValue: getValue,
        getValues: getValues,
        getDefaultValue: getDefaultValue,
        getDefaultValues: getDefaultValues,
        setValue: setValue,
        apply: apply,
        clear: clear
    });

    return instance;
}

module.exports = proxy;
