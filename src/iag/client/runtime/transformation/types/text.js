/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');

module.exports = function TextTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.text);

    function calculate(variableValue, defaultAttributes) {
        return translate(variableValue, model.getDefaultValue(defaultAttributes.text));
    }

    function apply(text) {
        return {
            text: text
        };
    }

    return {
        attributes: ['text'],
        interpolate: interpolation.text,
        calculate: calculate,
        apply: apply
    };
};
