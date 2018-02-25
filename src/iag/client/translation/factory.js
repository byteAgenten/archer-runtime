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
