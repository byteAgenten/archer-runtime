var _ = require('iag/client/util/language-utils');
var Variable = require('iag/client/runtime/variable/variable');
var Transformation = require('iag/client/runtime/transformation/transformation');
var Element = require('iag/client/runtime/element/element');
var Observable = require('iag/client/util/observable');
var Logger = require('iag/client/util/logger');
var assert = require('iag/client/util/assert');

function RuntimePrototype() {
} // Named prototype for debugging

function Runtime(graphic) {

    var document = graphic.document;
    var currentConfig = sanitizedConfig();

    var instance = new RuntimePrototype();
    var observable = Observable(graphic, 'runtime');
    var log = Logger('archer.runtime');

    var elements = {};
    var variables = {};
    var transformations = [];

    function load(config) {

        currentConfig = sanitizedConfig(config);

        clearConfig();
        initConfig();
        update();

        log.debug('Loaded configuration');
        log.debug('Loaded variables: ' + Object.keys(variables).length);
        log.debug('Loaded transformations: ' + transformations.length);
    }

    function initConfig() {
        currentConfig.elements.forEach(createElement);
        currentConfig.variables.forEach(createVariable);
        currentConfig.transformations.forEach(createTransformation);
    }

    function clearConfig() {
        _.forIn(variables, function (variable) {
            variable.destroy();
        });
        _.forEach(transformations, function (transformation) {
            transformation.destroy();
        });
        _.forIn(elements, function (element) {
            element.destroy();
        });
        elements = {};
        variables = {};
        transformations = [];
        log.debug('Cleared configuration');
    }

    function sanitizedConfig(config) {

        config = config || {};
        config.elements = config.elements || [];
        config.variables = config.variables || [];
        config.transformations = config.transformations || [];

        return config;
    }

    function update() {
        _.forEach(transformations, function (transformation) {
            transformation.schedule();
        });
    }

    function setValue(variableName, value, formattedValue) {

        var variable = getVariable(variableName);

        if (variable) {
            return variable.setValue(value, formattedValue);
        }

        log.warn('Variable does not exist: ' + variableName);
    }

    function getValue(variableName) {

        var variable = getVariable(variableName);

        return variable ? variable.value : null;
    }

    function createVariable(variableConfig) {

        try {
            var variable = Variable(variableConfig, graphic);

            variables[variableConfig.name] = variable;
        } catch (e) {
            log.error('Error initializing variable: ' + variableConfig.name, e);
        }
    }

    function createTransformation(transformationConfig) {

        try {
            var transformation = Transformation(transformationConfig, graphic);

            transformations.push(transformation);
        } catch (e) {
            log.error('Error initializing transformation: ' + transformationConfig.name, e);
        }
    }

    function createElement(elementConfig) {

        var elementId = elementConfig.id;

        try {
            var domElement = document.getElement(elementId);

            assert(!!domElement, 'Element does not exist: ' + elementId);

            var element = new Element(elementConfig, domElement, graphic);

            elements[elementId] = element;
        } catch (e) {
            log.error('Error initializing element: ' + elementId, e);
        }
    }

    function wrapElement(elementOrId) {

        var domElement = typeof elementOrId == 'string' ? document.getElement(elementOrId) : document.wrap(elementOrId);

        if (!domElement) return null;

        var element = new Element({}, domElement, graphic);

        if (domElement.node.id) elements[domElement.node.id] = element;

        return element;
    }

    function getElement(elementOrId) {

        assert(elementOrId, 'Must specify node or node ID');

        const elementId = typeof elementOrId == 'string' ? elementOrId : elementOrId.id;

        return elements[elementId] || wrapElement(elementOrId);
    }

    function getVariable(name) {
        return variables[name];
    }

    function destroy() {
        clearConfig();
        observable.destroy();
    }

    // API
    _.assign(instance, observable);
    _.assign(instance, {
        load: load,
        getValue: getValue,
        setValue: setValue,
        getElement: getElement,
        getVariable: getVariable,
        get config() {
            return currentConfig;
        },
        destroy: destroy
    });

    return instance;
}

module.exports = Runtime;
