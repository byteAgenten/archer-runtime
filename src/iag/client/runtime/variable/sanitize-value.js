/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var _ = require('iag/client/util/language-utils');

module.exports = function sanitizeValue(value, model) {

    var type = model.type;

    // Number
    // Make sure that value is between min and max
    if (type == 'number' && _.isNumber(value)) {

        var min = model.minimum;
        var max = model.maximum;

        if (value < min) value = min;
        if (value > max) value = max;
    }

    return value;
};
