var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');
var util = require('iag/client/util/util');

module.exports = function ScaleTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.point);
    var centerOption = model.center;
    var axisOption = model.axis;

    function calculate(variableValue) {
        var scaling = translate(variableValue, model.getDefaultValue({ x: 1, y: 1 }));

        if (axisOption == 'x') scaling.y = 1;
        if (axisOption == 'y') scaling.x = 1;

        return scaling;
    }

    function apply(scaling, currentAttributes) {

        var bbox = currentAttributes.bbox;
        var transform = currentAttributes.transform;

        var center = util.getBoxPosition(bbox, centerOption);
        var scaleMatrix = new Snap.Matrix().scale(scaling.x, scaling.y, center.x, center.y);

        var localMatrix = transform.localMatrix.clone()
            .add(scaleMatrix);

        return {
            transform: {
                localMatrix: localMatrix,
                totalMatrix: transform.totalMatrix.clone().add(scaleMatrix)
            }
        };
    }

    return {
        attributes: ['transform', 'bbox'],
        interpolate: interpolation.point,
        calculate: calculate,
        apply: apply
    };
};
