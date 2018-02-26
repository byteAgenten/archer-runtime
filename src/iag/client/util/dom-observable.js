/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var Observable = require('iag/client/util/observable');
var screenBBox = require('iag/client/util/screen-bbox');

function DomObservable() {
}

/**
 * Extended observable that can listen to DOM events (click, mouseover, ...)
 * Also enables bubbling DOM events through the client, so that a user can capture all DOM events of a certain type
 * with a single listener (graphic.on('element.click', ...))
 * The implementation makes sure that for each event type, there is only one listener on the DOM element
 * This ensures that if there are several listeners for the same DOM event, the observable will still only emit once
 * @constructor
 */
function domObservable(domElement, parent, prefix) {

    var instance = new DomObservable();
    var observable = Observable(parent, prefix);

    var domListeners = {};

    function on(event, callback) {
        observable.on(event, callback);
        addDomListener(event);
    }

    function off(event, callback) {
        observable.off(event, callback);
        removeDomListener(event);
    }

    function destroy() {
        observable.destroy();

        var events = Object.keys(domListeners);
        events.forEach(removeDomListener);
    }

    function addDomListener(event) {

        // We only need one DOM listener per event
        if (domListeners[event]) return;

        domElement.node.addEventListener(event, emitDomEvent);
        domListeners[event] = true;
    }

    function removeDomListener(event) {

        // We remove the DOM listener if there are no more listeners for that event
        if (observable.getListeners(event).length > 0) return;

        domElement.node.removeEventListener(event, emitDomEvent);
        delete domListeners[event];
    }

    function emitDomEvent(event) {

        var extendedEvent = _.assign(event, {
            bbox: screenBBox(domElement.node)
        });

        observable.emit(event.type, domElement.node, extendedEvent);
    }

    // API
    _.assign(instance, observable);
    _.assign(instance, {
        on: on,
        off: off,
        destroy: destroy
    });

    return instance;
}

module.exports = domObservable;
