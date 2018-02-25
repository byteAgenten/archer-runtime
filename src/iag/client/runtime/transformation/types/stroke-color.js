var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');

module.exports = function StrokeColorTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.color);

    function calculate(variableValue, defaultAttributes) {
        return translate(variableValue, model.getDefaultValue(defaultAttributes.stroke));
    }

    function apply(color) {
        return {
            stroke: color
        };
    }

    return {
        attributes: ['stroke'],
        interpolate: interpolation.color,
        calculate: calculate,
        apply: apply
    };
};
