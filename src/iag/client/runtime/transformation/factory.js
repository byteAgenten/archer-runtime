var assert = require('iag/client/util/assert');

var types = {};
register('translate', require('iag/client/runtime/transformation/types/translate'));
register('rotate', require('iag/client/runtime/transformation/types/rotate'));
register('scale', require('iag/client/runtime/transformation/types/scale'));
register('text', require('iag/client/runtime/transformation/types/text'));
register('image-url', require('iag/client/runtime/transformation/types/image-url'));
register('opacity', require('iag/client/runtime/transformation/types/opacity'));
register('fill-color', require('iag/client/runtime/transformation/types/fill-color'));
register('stroke-color', require('iag/client/runtime/transformation/types/stroke-color'));
register('stroke-width', require('iag/client/runtime/transformation/types/stroke-width'));

function register(type, transformation) {
    types[type] = transformation;
}

function create(model, graphic) {

    var transformationType = model.type;
    var TransformationSpecialization = types[transformationType];

    assert(!!TransformationSpecialization, 'Unknown transformation type: ' + transformationType);

    return TransformationSpecialization(model, graphic);
}

module.exports = {
    register: register,
    create: create
};
