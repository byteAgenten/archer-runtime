module.exports = function mapping(frames) {

    return function translate(index, defaultValue) {

        var frame = frames.map[index];

        return frame && frame.value != null
            ? frame.value
            : defaultValue;
    };
};
