var _ = require('iag/client/util/language-utils');

var DEFAULTS = {
    mode: 'embedded',
    imageRendering: 'quality'
};

module.exports = function settings(options) {

    var result = _.assign({}, DEFAULTS, options);

    return result;
};
