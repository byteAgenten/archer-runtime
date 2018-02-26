/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');

var DEFAULTS = {
    mode: 'embedded',
    imageRendering: 'quality'
};

module.exports = function settings(options) {

    var result = _.assign({}, DEFAULTS, options);

    return result;
};
