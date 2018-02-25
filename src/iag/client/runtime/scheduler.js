var _ = require('iag/client/util/language-utils');
var Observable = require('iag/client/util/observable');
var Logger = require('iag/client/util/logger');

function Scheduler() {
} // Named prototype for debugging

/**
 * Creates a scheduler that manages the update/render process for a runtime
 * - Divides the update process in 3 phases (1. reset elements, 2. calculate transformations, 3. render elements)
 * - Executes tasks in each phase in prioritized order
 * - Defers execution of tasks into next animation frame
 * @returns {Scheduler}
 */
function scheduler(graphic) {

    var instance = new Scheduler();
    var observable = Observable(graphic, 'scheduler');
    var log = Logger('archer.scheduler');

    var resetPhase = [];
    var transformPhase = [];
    var renderPhase = [];

    var requestId = null;

    var scheduleReset = _.curry(schedule)(resetPhase);
    var scheduleTransform = _.curry(schedule)(transformPhase);
    var scheduleRender = _.curry(schedule)(renderPhase);

    function schedule(phase, fn, priority) {

        var newTask = Task(fn, priority);

        phase.push(newTask);

        // Schedule execution for next animation frame
        if (!requestId) {
            requestId = requestAnimationFrame(execute);
        }

        return Remover(phase, newTask);
    }

    function Task(fn, priority) {
        return {
            priority: priority || 0,
            apply: function () {
                fn.call();
            }
        };
    }

    function Remover(phase, task) {
        return function () {
            var index = phase.indexOf(task);
            if (index >= 0) phase.splice(index, 1);
        };
    }

    function execute() {

        observable.emit('start');
        executePhase(resetPhase, 'reset');
        observable.emit('reset');
        executePhase(transformPhase, 'transform');
        observable.emit('transform');
        executePhase(renderPhase, 'render');
        observable.emit('render');

        requestId = null; // Reset request flag

        observable.emit('complete');
    }

    function executePhase(phase, phaseName) {

        log.debug('Execute ' + phaseName + ' phase');

        prioritize(phase);

        while (phase.length) {

            var task = phase.shift();

            try {
                task.apply();
            } catch (e) {
                log.error('Error executing task in ' + phaseName + ' phase', e);
            }
        }
    }

    function prioritize(phase) {
        phase.sort(function (left, right) {
            return right.priority - left.priority;
        }); // Desc
    }

    function destroy() {
        if (requestId) cancelAnimationFrame(requestId);
        resetPhase = [];
        transformPhase = [];
        renderPhase = [];
        observable.destroy();
    }

    // API
    _.assign(instance, observable);
    _.assign(instance, {
        scheduleReset: scheduleReset,
        scheduleTransform: scheduleTransform,
        scheduleRender: scheduleRender,
        destroy: destroy
    });

    return instance;
}

module.exports = scheduler;
