/**
 * Created by Sascha on 22.02.16.
 */
define(function (require) {

    var helpers = require('helpers');

    describe('element-dom-event-configuration', function () {

        const EVENT_CONFIGURATION = {
            elements: [
                {
                    id: 'rect',
                    events: [
                        'click',
                        'mouseover',
                        'mouseout'
                    ]
                }
            ]
        };

        const UPDATED_EVENT_CONFIGURATION = {
            elements: [
                {
                    id: 'rect',
                    events: [
                        'click'
                    ]
                }
            ]
        };

        it('should add listeners for configured DOM events', function (done) {

            var graphic = helpers.setupDefaultGraphic('box.svg', 'empty.config.json');

            graphic.on('ready', function () {

                graphic.runtime.load(EVENT_CONFIGURATION);

                var clickCallback = jasmine.createSpy();
                var mouseOverCallback = jasmine.createSpy();
                var mouseOutCallback = jasmine.createSpy();

                graphic.on('element.click', clickCallback);
                graphic.on('element.mouseover', mouseOverCallback);
                graphic.on('element.mouseout', mouseOutCallback);

                helpers.trigger(Snap('#rect'), 'mouseover');
                helpers.trigger(Snap('#rect'), 'click');
                helpers.trigger(Snap('#rect'), 'mouseout');

                expect(clickCallback).toHaveBeenCalled();
                expect(mouseOverCallback).toHaveBeenCalled();
                expect(mouseOutCallback).toHaveBeenCalled();
                done();
            });
        });

        it('should update listeners for configured DOM events', function (done) {

            var graphic = helpers.setupDefaultGraphic('box.svg', 'empty.config.json');

            graphic.on('ready', function () {

                graphic.runtime.load(EVENT_CONFIGURATION);

                var clickCallback = jasmine.createSpy();
                var mouseOverCallback = jasmine.createSpy();
                var mouseOutCallback = jasmine.createSpy();

                graphic.on('element.click', clickCallback);
                graphic.on('element.mouseover', mouseOverCallback);
                graphic.on('element.mouseout', mouseOutCallback);

                graphic.runtime.load(UPDATED_EVENT_CONFIGURATION);

                helpers.trigger(Snap('#rect'), 'mouseover');
                helpers.trigger(Snap('#rect'), 'click');
                helpers.trigger(Snap('#rect'), 'mouseout');

                expect(clickCallback).toHaveBeenCalled();
                expect(mouseOverCallback).not.toHaveBeenCalled();
                expect(mouseOutCallback).not.toHaveBeenCalled();
                done();
            });
        });
    });
});