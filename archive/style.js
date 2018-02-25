/**
 * Created with IntelliJ IDEA.
 * User: sascha
 * Date: 22.04.13
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */

define(['iag/client/runtime/transformation/transformation', 'iag/client/runtime/transformation/conversions', 'iag/client/util/util'], function (Transformation, conversions, Util) {

    var StyleTransformation = function (config, runtime, document) {
        Transformation.call(this, config, runtime, document);
    };

    Util.extend(StyleTransformation, Transformation);

    StyleTransformation.prototype.init = function () {

        var defaultTranslation = function (variable, config) {
            return conversions.mapValue(variable.value, config.mapping, variable);
        }.bind(this);

        this.observeVariable(this.config.variable);
        this.setTranslationFn(this.config.variable, defaultTranslation, this.config.translationFn);

        this.originalStyleValue = this.element.attr(this.config.styleType);
    };

    StyleTransformation.prototype.apply = function () {

        var styleValue = this.getValue(this.config.variable);

        if (styleValue != null)
            this.element.attr(this.config.styleType, styleValue);
    };

    StyleTransformation.prototype.reset = function () {

        this.element.attr(this.config.styleType, this.originalStyleValue);
    };

    return StyleTransformation;
});