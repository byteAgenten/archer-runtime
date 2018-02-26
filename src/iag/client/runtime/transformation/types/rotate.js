/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');
var util = require('iag/client/util/util');

module.exports = function RotateTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.number);
    var centerOption = model.center;

    function calculate(variableValue) {
        return translate(variableValue, model.getDefaultValue(0));
    }

    function apply(angle, currentAttributes) {

        var bbox = currentAttributes.bbox;
        var transform = currentAttributes.transform;

        var center = util.getBoxPosition(bbox, centerOption);
        var centerX = transform.totalMatrix.x(center.x, center.y);
        var centerY = transform.totalMatrix.y(center.x, center.y);
        var rotateMatrix = new Snap.Matrix().rotate(angle, centerX, centerY);

        var localMatrix = transform.localMatrix.clone()
            .add(transform.totalMatrix.invert())
            .add(rotateMatrix)
            .add(transform.totalMatrix);

        return {
            transform: {
                localMatrix: localMatrix,
                totalMatrix: rotateMatrix.add(transform.totalMatrix)
            }
        };
    }

    return {
        attributes: ['bbox', 'transform'],
        interpolate: interpolation.number,
        calculate: calculate,
        apply: apply
    };
};
