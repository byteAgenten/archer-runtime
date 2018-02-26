/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var _ = require('iag/client/util/language-utils');

module.exports = function formatValue(value, formattedValue, valueType) {

    // If formatted was provided then return that
    if (formattedValue !== undefined) return formattedValue;

    // Round number values to integer
    if (valueType == 'number' && _.isNumber(value)) {
        return Math.round(value);
    }

    // Otherwise just keep value
    return value;
};
