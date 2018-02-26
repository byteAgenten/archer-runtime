/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var mouseOffset = require('iag/client/util/mouse-offset');
var animation = require('iag/client/util/animate');

function Mouse(view, graphicDocument) {

    var ZOOM_MOUSE_WHEEL_FACTOR = 0.001;
    var ZOOM_MOUSE_WHEEL_MAX_LIMIT = 1.25;
    var ZOOM_MOUSE_WHEEL_MIN_LIMIT = 0.8;

    var MOVE_DRAG_EASING_TRESHOLD = 100;
    var MOVE_DRAG_EASING_FACTOR = 5;
    var MOVE_DRAG_EASING_DURATION = 600;

    var instance = {};

    // Pan
    var mousePanPosition;
    var panMoveTimestamp;
    var panMoveDelta;
    var touchPanPosition;

    // Pinch to zoom
    var pinchStartDistance;
    var pinchZoomTarget;
    var pinchStartZoomLevel;

    var container = graphicDocument.element;

    function enable(enablePan, enableZoom) {

        container.removeEventListener('mousedown', mouseDownHandler);
        container.removeEventListener('wheel', mouseWheelHandler);
        container.removeEventListener('mousemove', mouseDragHandler);
        container.removeEventListener('touchstart', touchStart);
        container.removeEventListener('touchmove', touchMove);
        container.removeEventListener('touchend', touchEnd);
        window.removeEventListener('mouseup', mouseUpHandler);

        if (enablePan) {
            container.addEventListener('mousedown', mouseDownHandler);
        }

        if (enableZoom) {
            container.addEventListener('wheel', mouseWheelHandler);
            container.addEventListener('touchstart', touchStart);
            container.addEventListener('touchmove', touchMove);
            container.addEventListener('touchend', touchEnd);
        }
    }

    function calculateTouchDistance(event) {
        var t1 = event.touches[0];
        var t2 = event.touches[1];

        var x = t2.pageX - t1.pageX;
        var y = t2.pageY - t1.pageY;

        return Math.sqrt((x * x) + (y * y));
    }

    function calculateTouchCenter(event) {
        var t1 = event.touches[0];
        var t2 = event.touches[1];
        var x1 = Math.min(t1.pageX, t2.pageX);
        var x2 = Math.max(t1.pageX, t2.pageX);
        var y1 = Math.min(t1.pageY, t2.pageY);
        var y2 = Math.max(t1.pageY, t2.pageY);

        return {
            x: x1 + ((x2 - x1) / 2),
            y: y1 + ((y2 - y1) / 2)
        };
    }

    function calculateZoomTarget(offset) {
        var viewport = view.viewport;
        var viewBounds = viewport.viewBounds;

        var center = {
            x: offset.x / viewBounds.width,
            y: offset.y / viewBounds.height
        };

        return {
            x: viewport.x + (viewport.width * center.x),
            y: viewport.y + (viewport.height * center.y)
        };
    }

    function panFadeOut() {
        // Ease out movement if user has dragged the viewport within a certain time frame
        if (panMoveTimestamp && (new Date().getTime() - panMoveTimestamp) < MOVE_DRAG_EASING_TRESHOLD) {

            var viewport = view.viewport;
            var delta = viewport.fromPx({
                x: -panMoveDelta.x * MOVE_DRAG_EASING_FACTOR,
                y: -panMoveDelta.y * MOVE_DRAG_EASING_FACTOR
            });

            view.setViewport(
                viewport.moveBy(delta.x, delta.y),
                true, animation.easeoutqart, MOVE_DRAG_EASING_DURATION
            );
        }
    }

    function mouseDownHandler(event) {

        // Store initial position
        mousePanPosition = {
            x: event.clientX,
            y: event.clientY
        };

        // Register mouse drag handler
        container.addEventListener('mousemove', mouseDragHandler);
        window.addEventListener('mouseup', mouseUpHandler);
    }

    function mouseDragHandler(event) {

        // Calculate moved distance
        var dx = event.clientX - mousePanPosition.x;
        var dy = event.clientY - mousePanPosition.y;

        // Store new position
        panMoveTimestamp = new Date().getTime();
        panMoveDelta = {
            x: dx,
            y: dy
        };
        mousePanPosition = {
            x: event.clientX,
            y: event.clientY
        };

        // Move viewport
        var viewport = view.viewport;
        var delta = viewport.fromPx({ x: -dx, y: -dy });

        view.setViewport(
            viewport.moveBy(delta.x, delta.y)
        );
    }

    function mouseUpHandler() {

        panFadeOut();

        // Remove handlers
        container.removeEventListener('mousemove', mouseDragHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        mousePanPosition = null;
        panMoveTimestamp = null;
    }

    function mouseWheelHandler(event) {

        var viewport = view.viewport;
        var offset = mouseOffset(container, event);
        var target = calculateZoomTarget(offset);

        var delta = event.deltaY;

        // With a trackpad, a pinch to zoom gesture still results in a wheel event,
        // however the ctrlKey is set to true
        // In this case we increase the delta, otherwise pinch to zoom is rather slow
        if (event.ctrlKey) {
            delta *= 5;
        }

        var factor = (1 + (delta * ZOOM_MOUSE_WHEEL_FACTOR * -1));
        factor = Math.min(factor, ZOOM_MOUSE_WHEEL_MAX_LIMIT);
        factor = Math.max(factor, ZOOM_MOUSE_WHEEL_MIN_LIMIT);

        var zoomLevel = viewport.zoomLevel * factor;

        view.setViewport(
            viewport.zoomTo(zoomLevel, target)
        );

        event.preventDefault();
    }

    function touchStart(event) {

        if (!event.touches || !event.touches.length) return;

        touchPanPosition = event.touches[0];

        if (event.touches.length == 2) {
            touchPanPosition = null;
            pinchStartDistance = calculateTouchDistance(event);
            pinchStartZoomLevel = view.viewport.zoomLevel;

            var center = calculateTouchCenter(event);
            var offset = mouseOffset(container, { pageX: center.x, pageY: center.y });
            pinchZoomTarget = calculateZoomTarget(offset);
        }
    }

    function touchMove(event) {

        if (!event.touches || !event.touches.length) return;

        if (event.touches.length == 1 && touchPanPosition) {

            var t1 = event.touches[0];

            // Calculate moved distance
            var dx = t1.pageX - touchPanPosition.pageX;
            var dy = t1.pageY - touchPanPosition.pageY;

            // Store new position
            panMoveTimestamp = new Date().getTime();
            panMoveDelta = {
                x: dx,
                y: dy
            };

            touchPanPosition = t1;

            // Move viewport
            var viewport = view.viewport;
            var delta = viewport.fromPx({ x: -dx, y: -dy });

            view.setViewport(
                viewport.moveBy(delta.x, delta.y)
            );

            event.preventDefault();
        }

        if (event.touches.length == 2) {

            var factor = calculateTouchDistance(event) / pinchStartDistance;

            view.setViewport(
                view.viewport.zoomTo(pinchStartZoomLevel * factor, pinchZoomTarget)
            );

            event.preventDefault();
        }
    }

    function touchEnd() {

        panFadeOut();
        mousePanPosition = null;
        panMoveTimestamp = null;
    }

    _.assign(instance, {
        enable: enable
    });

    return instance;
}

module.exports = Mouse;
