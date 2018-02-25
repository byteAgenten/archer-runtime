var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');

module.exports = function FillColorTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.color);

    function calculate(variableValue, defaultAttributes) {
        return translate(variableValue, model.getDefaultValue(defaultAttributes.fill));
    }

    function apply(color) {
        return {
            fill: color
        };
    }

    return {
        attributes: ['fill'],
        interpolate: interpolation.color,
        calculate: calculate,
        apply: apply,
    };
};
