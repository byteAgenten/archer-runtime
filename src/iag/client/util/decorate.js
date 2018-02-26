/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 module.exports = function decorate(fn) {

    for (var i = 1; i < arguments.length; i++) {

        var decorator = arguments[i];

        fn = decorator(fn);
    }

    return fn;
};
