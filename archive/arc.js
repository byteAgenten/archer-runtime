/**
 * Created with IntelliJ IDEA.
 * User: sascha
 * Date: 22.04.13
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */

define(['iag/client/runtime/transformation/transformation', 'iag/client/runtime/transformation/conversions', 'iag/client/util/util'], function (Transformation, conversions, Util) {

    var ArcTransformation = function (config, runtime, document) {

        Transformation.call(this, config, runtime, document);
    };

    Util.extend(ArcTransformation, Transformation);

    ArcTransformation.prototype.init = function () {

        var defaultTranslation = function (variable, config) {
            return conversions.linearAngleInterpolation(variable.value, this.limit.asRange(), config.range, config.clockWise);
        }.bind(this);

        this.observeVariable(this.config.bindings.value);
        this.setTranslationFn(this.config.bindings.value, defaultTranslation, this.config.translationFn);

        this.originalPath = this.element.attr('d');
    };

    ArcTransformation.prototype.apply = function () {

        var config = this.config;
        var angle = this.getValue(config.bindings.value);
        var path = Util.createArcPath(config.center.x, config.center.y, config.radius, config.range.from, angle, config.clockwise);

        this.element.attr('d', path);
    };

    ArcTransformation.prototype.reset = function () {

        this.element.attr('d', this.originalPath);
    };

    return ArcTransformation;
});