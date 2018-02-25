/**
 * Created by Sascha on 10.07.14.
 */
define(['iag/client/util/dispatcher', 'iag/client/util/util'], function (Dispatcher, Util) {

    var Notification = function (config, runtime, document) {
        this.config = config;
        this.runtime = runtime;
        this.document = document;
    };

    Dispatcher.call(Notification);

    Notification.createInstances = function (config, runtime, document) {

        var notifications = [];

        $.each(config.elements, function (i, elementId) {

            $.each(config.events, function (i, eventType) {

                var specificConfig = {
                    element: elementId,
                    event: eventType
                };

                var notification = new Notification(specificConfig, runtime, document);

                notification.register();

                notifications.push(notification);
            });
        });

        return notifications;
    };

    Notification.prototype.register = function () {

        var element = this.document.find('#' + this.config.element);

        if (!element) {
            console.warn('Notification element does not exist: ' + this.config.element);
            return;
        }

        var handler = function () {

            // Send elements bounding box as convenience
            var boundingBox = Util.getBBox(element.node);

            // Dispatch event from runtime and locally
            this.runtime.dispatch(this.config.event, this.config.event, this.element, boundingBox);
            this.dispatch(this.config.event, this.config.event, this.element, boundingBox);

        }.bind(this);

        $(element.node).on(this.config.event.toLowerCase(), handler);

        this.element = element;
        this.handler = handler;
    };

    Notification.prototype.destroy = function () {

        if (!this.element || this.handler) return;

        $(this.element.node).off(this.handler);

        this.handler = null;
        this.element = null;

        this.dispatch('destroyed');
    };

    return Notification;
});