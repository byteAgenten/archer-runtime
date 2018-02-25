/**
 * Created by Sascha on 21.05.15.
 */
define([
    'lodash',
    'iag/client/util/extend',
    'iag/client/util/assert'
], function (_,
             extend,
             assert) {

    var ConfigMixin = {

        init: function () {

            var frameConfigs = this.getOption('frames') || [];

            this._frames = _.indexBy(_.map(frameConfigs, toFrame), 'name');
        },

        get name() {
            return this._config['name'];
        },

        get frames() {
            return this._frames;
        },

        get transition() {
            return this._config['transition'];
        },

        get priority() {
            return this._config['priority'];
        },

        getOption: function (optionName) {
            return this._config[optionName];
        },

        getFrame: function (thresholdName) {
            return this._frames[thresholdName];
        }
    };

    var Frame = function (config) {
        this._config = config;
    };

    extend(Frame.prototype, {

        get name() {
            return this._config['name'];
        },

        get value() {
            return this._config['value'];
        },

        get transition() {
            return this._config['transition'];
        }
    });

    function toFrame(config, thresholdName) {

        config.name = thresholdName;

        return new Frame(config);
    }

    return ConfigMixin;
});