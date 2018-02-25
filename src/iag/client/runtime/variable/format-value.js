var _ = require('iag/client/util/language-utils');

module.exports = function formatValue(value, formattedValue, valueType) {

    // If formatted was provided then return that
    if (formattedValue !== undefined) return formattedValue;

    // Round number values to integer
    if (valueType == 'number' && _.isNumber(value)) {
        return Math.round(value);
    }

    // Otherwise just keep value
    return value;
};
