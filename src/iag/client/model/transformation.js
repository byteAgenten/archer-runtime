/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _ = require('iag/client/util/language-utils');
var Frames = require('iag/client/model/frames');

function TransformationModel(config, variableModel) {

    var frames = Frames(variableModel.type, variableModel.keyFrames, config.frames);
    var name = config.name
        ? config.name
        : config.type + '_' + config.element;

    function getDefaultValue(defaultValue) {

        var defaultFrame = config.frames.$default;

        return defaultFrame
            ? defaultFrame.value
            : defaultValue;
    }

    return _.assign(
        {},
        config,
        {
            name: name,
            config: config,
            variable: variableModel,
            frames: frames,
            getDefaultValue: getDefaultValue
        }
    );
}

module.exports = TransformationModel;
