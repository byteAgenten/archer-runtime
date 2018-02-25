var _ = require('iag/client/util/language-utils');
var TransformationFactory = require('iag/client/runtime/transformation/factory');
var TransformationModel = require('iag/client/model/transformation');
var Observable = require('iag/client/util/observable');
var Logger = require('iag/client/util/logger');
var assert = require('iag/client/util/assert');
var animate = require('iag/client/util/animate');

/**
 * Creates a transformation manager
 * - Schedules the transformation for the transform phase when the variable value changes
 * - Manages creation of the transform function and adds it to the element
 * - Manages execution of the transform function
 * @param config
 * @param graphic
 * @returns {Transformation}
 */
function Transformation(config, graphic) {

    var runtime = graphic.runtime;
    var scheduler = graphic.scheduler;

    var transformation = {};
    var observable = Observable(graphic, 'transformation');
    var log = Logger('archer.transformation');

    var variable;
    var element;
    var transform;
    var model;
    var updater;

    var removeListener;
    var removeSchedule;
    var removeTransform;

    init();

    function init() {

        variable = runtime.getVariable(config.variable);
        element = runtime.getElement(config.element);

        assert(!!variable, 'Variable does not exist: ' + config.variable);
        assert(!!element, 'Element does not exist: ' + config.element);

        model = TransformationModel(config, variable.model);
        transform = TransformationFactory.create(model, graphic);
        updater = _.isObject(model.transition)
            ? TransitionUpdater(model, transform, applyTransform)
            : DiscreteUpdater(model, transform, applyTransform);

        observe();
    }

    function update() {

        var defaultAttributes = element.getDefaultValues(transform.attributes);
        var transformValue = model.bind
            ? variable.formattedValue
            : transform.calculate(variable.value, defaultAttributes);

        updater.update(transformValue, defaultAttributes);

        observable.emit('update', model);
        log.debug('Updated transformation', { name: model.name });
    }

    function applyTransform(transformValue) {

        addTransform(element, function () {

            var currentAttributes = element.getValues(transform.attributes);
            var changes = transform.apply(transformValue, currentAttributes);

            Object.keys(changes).forEach(function (attribute) {

                // Sanity check:
                // If a transform did not request an attribute it may not set it
                if (transform.attributes.indexOf(attribute) < 0) {
                    log.warn('Transformation did not request access to modify attribute', {
                        name: model.name,
                        attribute: attribute
                    });
                    return;
                }

                element.setValue(attribute, changes[attribute]);
            });

            log.debug('Executed transformation', { name: model.name });
        });
    }

    function schedule() {
        unschedule();
        removeSchedule = scheduler.scheduleTransform(update, model.priority);
    }

    function unschedule() {
        removeSchedule && removeSchedule();
    }

    function observe() {
        unobserve();
        removeListener = variable.on('change', schedule);
    }

    function unobserve() {
        removeListener && removeListener();
    }

    function addTransform(el, transformFn) {
        clearTransform();
        removeTransform = el.transform(transformFn, model.priority);
    }

    function clearTransform() {
        removeTransform && removeTransform();
    }

    function destroy() {
        clearTransform();
        updater.destroy();
        unobserve();
        unschedule();
        observable.emit('destroy');
        observable.destroy();
    }

    // API
    return _.assign(
        transformation,
        observable,
        {
            model: model,
            schedule: schedule,
            destroy: destroy
        }
    );
}

function DiscreteUpdater(model, transform, applyTransform) {
    return {
        update: function (nextTransformValue) {
            applyTransform(nextTransformValue);
        },
        destroy: _.noop
    };
}

function TransitionUpdater(model, transform, applyTransform) {

    var log = Logger('archer.transformation.transition');

    var transition = model.transition;
    var duration = transition.duration;
    var easing = animate[transition.easing] || animate.linear;
    var interpolate = transform.interpolate;
    var animation;
    var previousTransformValue;
    var currentTransformValue;

    // If duration is no number, then mina animation will never stop
    // In this case fall back to discrete updates
    var isInvalidDuration = !_.isNumber(duration);

    if (isInvalidDuration) {
        log.warn('Invalid transition duration: ' + duration);
        return DiscreteUpdater(model, transform, applyTransform);
    }

    return {
        update: function (nextTransformValue) {

            previousTransformValue = currentTransformValue;

            if (animation) animation.stop();
            if (previousTransformValue == null) {
                currentTransformValue = nextTransformValue;
                previousTransformValue = nextTransformValue;
                applyTransform(currentTransformValue);
                return;
            }

            animation = animate(
                0,
                1,
                step,
                duration,
                easing
            );

            function step(factor) {
                currentTransformValue = interpolate(previousTransformValue, nextTransformValue, factor, easing);
                applyTransform(currentTransformValue);
            }
        },
        destroy: function () {
            if (animation) animation.stop();
        }
    };
}

module.exports = Transformation;
