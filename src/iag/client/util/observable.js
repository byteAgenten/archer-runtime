/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function Observable(parent, prefix) {

    var listenerMap = {};

    function getListeners(event) {

        var listeners = listenerMap[event];

        if (!listeners) {
            listeners = [];
            listenerMap[event] = listeners;
        }

        return listeners;
    }

    function on(event, callback) {

        var listeners = getListeners(event);
        listeners.push(callback);

        return off.bind(null, event, callback);
    }

    function off(event, callback) {

        var listeners = getListeners(event);
        var index = listeners.indexOf(callback);

        if (index >= 0) listeners.splice(index, 1);
    }

    function destroy() {
        listenerMap = {};
    }

    function emit(event) {
        call.apply(null, arguments);
        var prefixedEvent = prefixedName(event);
        var args = Array.prototype.slice.call(arguments, 1);
        if (parent) parent.bubble.apply(null, [prefixedEvent].concat(args));
    }

    function bubble() {
        call.apply(null, arguments);
        if (parent) parent.bubble.apply(null, arguments);
    }

    function call(event) {
        var listeners = getListeners(event);
        var args = Array.prototype.slice.call(arguments, 1);

        listeners.forEach(function (eventListener) {
            eventListener.apply(null, args);
        });
    }

    function prefixedName(event) {
        if (prefix) return prefix + '.' + event;
        return event;
    }

    return {
        on: on,
        off: off,
        emit: emit,
        bubble: bubble,
        getListeners: getListeners,
        destroy: destroy
    };
};
