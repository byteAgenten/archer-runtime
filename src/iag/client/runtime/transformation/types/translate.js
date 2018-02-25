var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');

module.exports = function TranslateTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.point);
    var axisOption = model.axis;

    function calculate(variableValue) {
        var translation = translate(variableValue, model.getDefaultValue({ x: 0, y: 0 }));

        if (axisOption == 'x') translation.y = 0;
        if (axisOption == 'y') translation.x = 0;

        return translation;
    }

    function apply(translation, currentAttributes) {
        var transform = currentAttributes.transform;

        var translateMatrix = new Snap.Matrix().translate(translation.x, translation.y);

        var localMatrix = transform.localMatrix.clone()
            .add(transform.totalMatrix.invert())
            .add(translateMatrix)
            .add(transform.totalMatrix);

        return {
            transform: {
                localMatrix: localMatrix,
                totalMatrix: translateMatrix.add(transform.totalMatrix)
            }
        };
    }

    return {
        attributes: ['transform'],
        interpolate: interpolation.point,
        calculate: calculate,
        apply: apply
    };
};
