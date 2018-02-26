/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var Viewport = require('iag/client/view/viewport');
var Mouse = require('iag/client/view/mouse');
var _ = require('iag/client/util/language-utils');
var Observable = require('iag/client/util/observable');
var animation = require('iag/client/util/animate');

var DEFAULT_ANIMATE_DURATION = 400;

function View() {
}

function view(graphic) {

    var instance = new View();
    var observable = Observable(graphic, 'view');
    _.assign(instance, observable);

    var graphicDocument = graphic.document;

    var currentViewport;
    var mouse;
    var viewportAnimation;

    initialize();

    function initialize() {

        // Initialize viewport
        currentViewport = Viewport();
        mouse = Mouse(instance, graphicDocument);

        resize();

        // Document events
        graphicDocument.on('contentChange', resize);
        window.addEventListener('resize', resize);
    }

    function destroy() {

        graphicDocument.off('contentChange', resize);
        graphicDocument = null;

        window.removeEventListener('resize', resize);
    }

    // region Viewport API

    function resize() {

        var contentBounds = graphicDocument.getContentBounds();
        var viewBounds = _.assign(graphicDocument.getViewBounds(), { x: 0, y: 0 });

        graphicDocument.contentLayer.attr({ width: viewBounds.width, height: viewBounds.height });

        setViewport(
            currentViewport
                .change({ viewBounds: viewBounds, contentBounds: contentBounds })
                .resize()
        );
    }

    function setViewport(viewport, animate, animateEasing, animateDuration) {

        if (viewportAnimation) viewportAnimation.stop();

        viewport = viewport.sanitize();

        if (animate) {

            animateEasing = animateEasing || animation.easeinout;
            animateDuration = animateDuration || DEFAULT_ANIMATE_DURATION;

            var from = [
                currentViewport.x,
                currentViewport.y,
                currentViewport.width,
                currentViewport.height
            ];

            var to = [
                viewport.x,
                viewport.y,
                viewport.width,
                viewport.height
            ];

            viewportAnimation = animation(from, to, step, animateDuration, animateEasing, complete);

            function step(values) {

                currentViewport = currentViewport.change({
                    zoomLevel: viewport.zoomLevel,
                    x: values[0],
                    y: values[1],
                    width: values[2],
                    height: values[3]
                });

                scheduleViewportChange();
            }

            function complete() {
                viewportAnimation = null;
            }

        } else {
            currentViewport = viewport;
            scheduleViewportChange();
        }
    }

    function scheduleViewportChange() {
        requestAnimationFrame(function () {
            applyViewPort();
            dispatchZoomChanged();
            dispatchViewportChanged();
        });
    }

    function applyViewPort() {

        var viewBox = [
            currentViewport.x,
            currentViewport.y,
            currentViewport.width,
            currentViewport.height
        ].join(' ');

        graphicDocument.contentLayer.attr({ 'viewBox': viewBox });
    }

    function zoomTo(zoomLevel, target, animate) {
        setViewport(
            currentViewport.zoomTo(zoomLevel, target),
            animate
        );
    }

    function zoomIn(factor, target, animate) {
        setViewport(
            currentViewport.zoomIn(factor, target),
            animate
        );
    }

    function zoomOut(factor, target, animate) {
        setViewport(
            currentViewport.zoomOut(factor, target),
            animate
        );
    }

    function zoomToFit(padding, animate) {
        setViewport(
            currentViewport.zoomToFit(padding),
            animate
        );
    }

    function zoomToOriginal(animate) {
        setViewport(
            currentViewport.zoomToOriginal(),
            animate
        );
    }

    function zoomToElements(elements, padding, animate) {
        setViewport(
            currentViewport.zoomToElements(elements, padding),
            animate
        );
    }

    function moveBy(dx, dy, animate) {
        setViewport(
            currentViewport.moveBy(dx, dy),
            animate
        );
    }

    function centerAt(x, y, animate) {
        setViewport(
            currentViewport.centerAt(x, y),
            animate
        );
    }

    function setBounds(bounds, animate) {
        setViewport(
            currentViewport.setBounds(bounds),
            animate
        );
    }

    // endregion

    // region Config

    function enableMouse(enablePan, enableZoom) {
        mouse.enable(enablePan, enableZoom);
    }

    // endregion

    // region Helper

    function dispatchZoomChanged() {
        observable.emit('zoomChange', currentViewport.zoomLevel);
    }

    function dispatchViewportChanged() {
        observable.emit('viewportChange', currentViewport);
    }

    // endregion

    // API
    _.assign(instance, {
        destroy: destroy,
        // Viewport
        resize: resize,
        setViewport: setViewport,
        zoomTo: zoomTo,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        zoomToFit: zoomToFit,
        zoomToOriginal: zoomToOriginal,
        zoomToElements: zoomToElements,
        moveBy: moveBy,
        centerAt: centerAt,
        setBounds: setBounds,
        // Query
        get zoomLevel() {
            return currentViewport.zoomLevel;
        },
        get viewport() {
            return currentViewport;
        },
        get viewBounds() {
            return currentViewport.viewBounds;
        },
        get contentBounds() {
            return currentViewport.contentBounds;
        },
        // Config
        enableMouse: enableMouse
    });

    return instance;
}

module.exports = view;
