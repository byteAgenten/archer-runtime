/**
 * Created by Sascha on 22.02.16.
 */
define(function (require, exports, module) {

    var archer = require('iag/client/client');

    module.exports = {
        clear,
        setupContainer,
        setupSvg,
        setupDefaultGraphic,
        trigger
    };

    const CONTAINER_MARKUP = `
    <div id="container"
         style="width: 200px; height: 200px;"></div>
    `;

    const BASE_RESOURCE_URL = 'base/tests/resources/';

    function clear() {
        return $('body').empty();
    }

    function setupContainer() {
        clear();
        return $(CONTAINER_MARKUP).appendTo('body');
    }

    function setupSvg() {
        clear();
        return Snap().appendTo($('body')[0]);
    }

    function setupDefaultGraphic(markupFile, configFile) {

        var container = setupContainer();
        var graphic = archer.create(container[0]);
        graphic.loadUrl(resourceUrl(markupFile), resourceUrl(configFile));

        graphic.container = container; // Export container for tests

        return graphic;
    }

    function trigger(element, type) {
        element.node.dispatchEvent(new MouseEvent(type));
    }

    function resourceUrl(file) {
        if (file.indexOf('base/') == 0) return file;
        return BASE_RESOURCE_URL + file;
    }
});