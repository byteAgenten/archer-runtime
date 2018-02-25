/**
 * Created by Sascha on 21.05.15.
 */
define([
    'lodash',
    'iag/client/runtime/translation/translation-factory'
], function (_,
             translationFactory) {

    var TranslatorMixin = {

        createTranslation: function (resultType, defaultValue) {

            var translationFn = translationFactory(this._variable, this, resultType, defaultValue);

            this.setTranslation(translationFn);
        },

        setTranslation: function (translationFn) {
            // Cache results
            this._translationFn = _.memoize(translationFn);
        },

        translate: function () {

            return this._variable.value != void(0) && this._translationFn ? this._translationFn.call(this, this._variable.value, this._variable.formattedValue) : null;
        }
    };

    return TranslatorMixin;
});