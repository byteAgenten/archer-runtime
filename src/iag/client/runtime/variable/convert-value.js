/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 module.exports = function convertValue(value, outputType) {

    var temp;

    if (outputType === 'boolean') {

        if (typeof value === 'string') {

            temp = parseFloat(value);

            if (isNaN(temp)) {
                return value.toLowerCase() === 'true' ? 1 : 0;
            }

            return temp > 0;

        } else if (typeof value === 'number') {

            return value > 0;
        }

    } else if (outputType === 'number') {

        if (typeof value === 'string') {

            temp = parseFloat(value);
            return isNaN(temp) ? null : temp;

        } else if (typeof value === 'boolean') {

            return value ? 1 : 0;
        }
    }

    return value;
};
