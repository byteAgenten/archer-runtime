/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function calculateScreenBBox(element) {

    // Screen bounds
    // Position and size in pixels including element and viewBox transforms
    var screenBounds = element.getBoundingClientRect();

    // Position relative to container
    var container = element.farthestViewportElement || element;
    var containerScreenBounds = container.getBoundingClientRect();

    var relativePosition = {
        left: screenBounds.left - containerScreenBounds.left,
        top: screenBounds.top - containerScreenBounds.top
    };

    // Position relative to document
    var pagePosition = {
        left: screenBounds.left + window.pageXOffset,
        top: screenBounds.top + window.pageYOffset
    };

    return {
        x: relativePosition.left,
        y: relativePosition.top,
        width: screenBounds.width,
        height: screenBounds.height,
        clientX: screenBounds.left,
        clientY: screenBounds.top,
        pageX: pagePosition.left,
        pageY: pagePosition.top
    };
};
