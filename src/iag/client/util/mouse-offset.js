/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function mouseOffset(element, event) {

    var rect = element.getBoundingClientRect();

    var offsetX = event.pageX - rect.left - window.pageXOffset;
    var offsetY = event.pageY - rect.top - window.pageYOffset;

    return {
        x: offsetX,
        y: offsetY
    };
};
