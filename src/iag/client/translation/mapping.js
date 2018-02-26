/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 module.exports = function mapping(frames) {

    return function translate(index, defaultValue) {

        var frame = frames.map[index];

        return frame && frame.value != null
            ? frame.value
            : defaultValue;
    };
};
