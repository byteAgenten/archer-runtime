var translationFactory = require('iag/client/translation/factory');
var interpolation = require('iag/client/util/interpolate');

module.exports = function ImageUrlTransform(model) {

    var translate = translationFactory(model.variable.type, model.frames, interpolation.text);

    function calculate(variableValue, defaultAttributes) {
        return translate(variableValue, model.getDefaultValue(defaultAttributes.href));
    }

    function apply(url) {
        return {
            href: url
        };
    }

    return {
        attributes: ['href'],
        interpolate: interpolation.text,
        calculate: calculate,
        apply: apply
    };
};
