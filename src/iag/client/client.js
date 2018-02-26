/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var Graphic = require('iag/client/graphic');

module.exports = {
    create: function (element) {
        return Graphic(element);
    }
};
