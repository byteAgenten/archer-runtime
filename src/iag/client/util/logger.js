/* eslint-disable no-console */
var enabled = {
    // debug: true,
    // info: true,
    warn: true,
    error: true
};

function stringifyArgument(arg) {
    if (arg == null) return null;
    if (arg instanceof Error) {
        return arg.message + '\n' + arg.stack;
    }
    if (JSON) {
        return JSON.stringify(arg);
    }

    return arg != null ? arg.toString() : arg;
}

function log(name, level, args) {

    if (!enabled[level]) return;

    var logFn = console[level] || console.log;
    var argsSummary = Array.prototype.map.call(args, stringifyArgument).join(' ');
    var message = '[' + name + '] ' + argsSummary;

    logFn.call(console, message);
}

function Logger(name) {
    return {
        debug: function () {
            log(name, 'debug', arguments);
        },
        info: function () {
            log(name, 'info', arguments);
        },
        warn: function () {
            log(name, 'warn', arguments);
        },
        error: function () {
            log(name, 'error', arguments);
        }
    };
}

Logger.enable = function (level) {
    enabled[level] = true;
};

Logger.disable = function (level) {
    enabled[level] = false;
};

Logger.levels = enabled;

module.exports = Logger;
