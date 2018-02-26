/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var Proxy = require('iag/client/runtime/element/proxy');
var Transformable = require('iag/client/runtime/element/transformable');
var DomObservable = require('iag/client/util/dom-observable');
var screenBBox = require('iag/client/util/screen-bbox');
var Logger = require('iag/client/util/logger');

function Element() {
} // Named prototype for debugging

/**
 * Creates a manager for a dom element.
 * - Manages DOM events for the element
 * - Exposes Transformable and Proxy functionality
 * - Schedules rendering when a transform function is registered or removed
 * @param config
 * @param domElement
 * @param graphic
 * @returns {Element}
 */
function element(config, domElement, graphic) {

    var document = graphic.document;
    var scheduler = graphic.scheduler;

    var instance = new Element();
    var observable = DomObservable(domElement, graphic, 'element');
    var proxy = Proxy(domElement, document);
    var transformable = Transformable(proxy);
    var log = Logger('archer.element');

    var removeRender;

    initEvents();

    function initEvents() {

        var events = config.events || [];

        // Add dummy listener for all configured events, so these will bubble to graphic
        events.forEach(function (event) {
            observable.on(event, _.noop);
        });
    }

    function transform(fn, priority) {

        var remover = transformable.transform(fn, priority);

        schedule();

        return function removeTransform() {
            remover();
            schedule(); // If transform is removed we need to render again
        };
    }

    function schedule() {
        unschedule();
        removeRender = scheduler.scheduleRender(render, 0);
        log.debug('Scheduled element render', { id: elementId() });
    }

    function unschedule() {
        removeRender && removeRender();
    }

    function render() {
        transformable.apply();
        proxy.apply();
        observable.emit('render', domElement);
        log.debug('Rendered element', { id: elementId() });
    }

    function destroy() {
        transformable.clear();
        proxy.clear();
        unschedule();
        scheduler.scheduleReset(render, 0); // Render once again in reset phase to reset DOM element to original values
        observable.emit('destroy');
        observable.destroy();
    }

    function elementId() {
        return domElement.node.id;
    }

    // API
    // Observable
    _.assign(instance, observable);
    _.assign(instance, {
        // Runtime
        getValue: proxy.getValue,
        getValues: proxy.getValues,
        getDefaultValue: proxy.getDefaultValue,
        getDefaultValues: proxy.getDefaultValues,
        setValue: proxy.setValue,
        transform: transform,
        destroy: destroy,
        // Utils
        getBBox: screenBBox.bind(null, domElement.node),
        get node() {
            return domElement.node;
        },
        get snapElement() {
            return domElement;
        }
    });

    return instance;
}

module.exports = element;
