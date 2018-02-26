/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var Util = require('iag/client/util/util');

var MIN_ZOOM_FACTOR = 0.01;
var MAX_ZOOM_FACTOR = 99.99;

function sanitizeZoomLevel(level) {
    return Math.max(MIN_ZOOM_FACTOR, Math.min(MAX_ZOOM_FACTOR, level));
}

var InitialState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    zoomLevel: 1,
    viewBounds: null,
    contentBounds: null
};

var ViewportProto = {

    get center() {
        return {
            x: this.contentBounds.x + (this.contentBounds.width / 2),
            y: this.contentBounds.y + (this.contentBounds.height / 2)
        };
    },

    change: function (state) {
        return Viewport.of(this, state);
    },

    resize: function () {
        return this.change({
            width: this.viewBounds.width / this.zoomLevel,
            height: this.viewBounds.height / this.zoomLevel
        });
    },

    moveBy: function (dx, dy) {
        return this.change({
            x: this.x + dx,
            y: this.y + dy
        });
    },

    centerAt: function (x, y) {
        return this.change({
            x: x - (this.width / 2),
            y: y - (this.height / 2)
        });
    },

    zoomTo: function (zoomLevel, target) {

        zoomLevel = sanitizeZoomLevel(zoomLevel);

        target = target || { x: this.x + (this.width / 2), y: this.y + (this.height / 2) };

        var viewBounds = this.viewBounds;
        var width = viewBounds.width / zoomLevel;
        var height = viewBounds.height / zoomLevel;

        var x = this.x - ((width - this.width) * ((target.x - this.x) / this.width));
        var y = this.y - ((height - this.height) * ((target.y - this.y) / this.height));

        return this.change({
            zoomLevel: zoomLevel,
            x: x,
            y: y,
            width: width,
            height: height
        });
    },

    zoomIn: function (factor, target) {
        return this.zoomTo(this.zoomLevel * factor, target);
    },

    zoomOut: function (factor, target) {
        return this.zoomTo(this.zoomLevel / factor, target);
    },

    zoomToFit: function (padding) {

        padding = padding || 0;

        var contentBounds = this.contentBounds;
        var viewBounds = this.viewBounds;
        var xRatio = viewBounds.width / (contentBounds.width + padding);
        var yRatio = viewBounds.height / (contentBounds.height + padding);
        var zoomLevel = Math.min(xRatio, yRatio);
        var center = this.center;

        return this.zoomTo(zoomLevel).centerAt(center.x, center.y);
    },

    zoomToOriginal: function () {

        var center = this.center;

        return this.zoomTo(1).centerAt(center.x, center.y);
    },

    zoomToElements: function (elements, padding) {

        var bounds = Util.getCombinedElementsBoundingBox(elements, padding);

        return this.setBounds(bounds);
    },

    setBounds: function (bounds) {

        var viewBounds = this.viewBounds;

        // Adjust the side with the higher zoom factor to preserve the current aspect ratio
        var horizontalZoom = viewBounds.width / bounds.width;
        var verticalZoom = viewBounds.height / bounds.height;
        var zoomLevel = sanitizeZoomLevel(Math.min(horizontalZoom, verticalZoom));

        var width = viewBounds.width / zoomLevel;
        var x = bounds.x - ((width - bounds.width) / 2);

        var height = viewBounds.height / zoomLevel;
        var y = bounds.y - ((height - bounds.height) / 2);

        return this.change({
            zoomLevel: zoomLevel,
            x: x,
            y: y,
            width: width,
            height: height
        });
    },

    sanitize: function () {

        var contentBounds = this.contentBounds;

        // Prevent moving out of content bounds
        var x = this.x;
        var y = this.y;

        x = Math.max(contentBounds.x - (this.width / 2), x);
        x = Math.min(contentBounds.x2 - (this.width / 2), x);

        y = Math.max(contentBounds.y - (this.height / 2), y);
        y = Math.min(contentBounds.y2 - (this.height / 2), y);

        return this.change({
            x: x,
            y: y
        });
    },

    toPx: function (point) {
        return {
            x: point.x * this.zoomLevel,
            y: point.y * this.zoomLevel
        };
    },

    fromPx: function (point) {
        return {
            x: point.x / this.zoomLevel,
            y: point.y / this.zoomLevel
        };
    }
};

function Viewport(state) {
    return _.assign(Object.create(ViewportProto), state || InitialState);
}

_.assign(Viewport, {
    of: function (viewport, state) {
        return Viewport(_.assign({}, viewport, state));
    }
});

module.exports = Viewport;
