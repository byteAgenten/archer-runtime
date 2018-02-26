/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');

module.exports = function OpacityTransform(model, graphic) {

    // Do not change visibility if we are embedded in editor
    // as this may conflict with visibility settings from SVG structure
    var enableVisibilityHidden = graphic.settings.mode != 'editor';

    var translate = translationFactory(model.variable.type, model.frames, interpolation.number);

    function calculate(variableValue, defaultAttributes) {
        return translate(variableValue, model.getDefaultValue(defaultAttributes.opacity));
    }

    function apply(opacityValue) {
        var changes = {
            opacity: opacityValue
        };

        // If opacity is 0 we set visibility to hidden, this will disable mouse events for the element
        // which is useful when working with layers
        // If opacity is not 0 we set visibility to inherit which would always display the element
        // unless a parent element is also hidden
        // Users might expect the element to show up even if visibility:hidden was set in markup/CSS
        if (enableVisibilityHidden) {
            changes.visibility = opacityValue == 0 ? 'hidden' : 'inherit';
        }

        return changes;
    }

    return {
        attributes: ['opacity', 'visibility'],
        interpolate: interpolation.number,
        calculate: calculate,
        apply: apply
    };
};
