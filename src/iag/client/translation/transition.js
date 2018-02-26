/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var assert = require('iag/client/util/assert');
var animate = require('iag/client/util/animate');

module.exports = function transition(frames, interpolate) {

    return function translate(index, defaultValue) {

        if (isInvalidIndex(index)) return defaultValue;

        // Determine bounding frames around index
        var bounds = boundaries(index, frames.series);

        var lowerValue = bounds.lower.value;
        var upperValue = bounds.upper.value;

        // If there is no value for lower frame then assume default value
        lowerValue = lowerValue != null
            ? lowerValue
            : defaultValue;

        // If there is no value for the upper frame then use lower frame value
        // Meaning the transition should just stay at the last defined value
        if (upperValue == null) {
            upperValue = bounds.upper.exists
                ? defaultValue
                : lowerValue;
        }

        var easing = animate[bounds.lower.easing];
        var factor = calculateFactor(index, bounds);

        return interpolate(lowerValue, upperValue, factor, easing);
    };
};

function isInvalidIndex(value) {
    return value == null
        || !_.isNumber(value);
}

function boundaries(index, frameSeries) {

    assert(!!frameSeries.length, 'Need at least one frame');

    var lowerFrame = null;
    var upperFrame = null;

    frameSeries.some(function (frame) {

        // Only consider frames that have a transformation value,
        // which means they were actually configured for the transformation
        if (!frame.exists) return false; // Continue

        // If frame index is bigger than search index, we know the frame is the upper bound
        if (frame.index > index) {
            upperFrame = frame;
            return true; // Break
        }

        // If we haven't found the upper bound we at least know the lower bound
        lowerFrame = frame;
    });

    // If a bound could not be determined then use min/max
    if (!lowerFrame) lowerFrame = frameSeries[0];
    if (!upperFrame) upperFrame = frameSeries[frameSeries.length - 1];

    return {
        lower: lowerFrame,
        upper: upperFrame
    };
}

function calculateFactor(index, bounds) {

    var upper = bounds.upper;
    var lower = bounds.lower;

    index = clampNumber(index, lower.index, upper.index);

    return ((index - lower.index) / (upper.index - lower.index)) || 0;
}

function clampNumber(value, min, max) {

    if (value < min) value = min;
    if (value > max) value = max;

    return value;
}
