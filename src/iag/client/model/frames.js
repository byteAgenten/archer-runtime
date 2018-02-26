/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function Frames(indexType, keyFrames, valueMap) {

    var series = [];
    var map = {};

    keyFrames.forEach(function (keyFrame) {

        var frameValue = valueMap[keyFrame.name];
        var frame = {
            name: keyFrame.name,
            index: keyFrame.value,
            exists: frameValue != undefined,
            value: frameValue ? frameValue.value : null,
            easing: frameValue ? frameValue.transition : null
        };

        series.push(frame);
        map[frame.index] = frame;
    });

    if (indexType == 'number') {
        series.sort(sortByIndex);
    }

    return {
        series: series,
        map: map
    };
}

function sortByIndex(left, right) {
    return left.index - right.index;
}

module.exports = Frames;
