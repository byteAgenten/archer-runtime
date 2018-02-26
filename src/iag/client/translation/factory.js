/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var transition = require('iag/client/translation/transition');
var mapping = require('iag/client/translation/mapping');
var assert = require('iag/client/util/assert');

var TRANSLATIONS = {
    'number': transition,
    'boolean': mapping,
    'text': mapping
};

module.exports = function translationFactory(indexType, frames, interpolate) {

    var translation = TRANSLATIONS[indexType];

    assert(!!translation, 'Unknown index type:' + indexType);

    return translation(frames, interpolate);
};
