module.exports = function decorate(fn) {

    for (var i = 1; i < arguments.length; i++) {

        var decorator = arguments[i];

        fn = decorator(fn);
    }

    return fn;
};
