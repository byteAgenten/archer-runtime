/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var _ = require('iag/client/util/language-utils');
var Observable = require('iag/client/util/observable');

var VariableModel = require('iag/client/model/variable');
var convertValue = require('iag/client/runtime/variable/convert-value');
var formatValue = require('iag/client/runtime/variable/format-value');
var sanitizeValue = require('iag/client/runtime/variable/sanitize-value');

function Variable(config, graphic) {

    var variable = {};
    var observable = Observable(graphic, 'variable');
    var model = VariableModel(config);

    var value;
    var formattedValue;

    setValue(model.defaultValue);

    function setValue(newValue, newFormattedValue) {

        newValue = convertValue(newValue, model.type);
        newValue = sanitizeValue(newValue, model);

        value = newValue;
        formattedValue = formatValue(newValue, newFormattedValue, model.type);

        observable.emit('change', variable, value, formattedValue);
    }

    function reset() {
        setValue(model.defaultValue);
    }

    function destroy() {
        observable.emit('destroy');
        observable.destroy();
    }

    // API
    return _.assign(
        variable,
        observable,
        {
            model: model,
            setValue: setValue,
            get value() {
                return value;
            },
            get formattedValue() {
                return formattedValue;
            },
            reset: reset,
            destroy: destroy
        }
    );
}

module.exports = Variable;
