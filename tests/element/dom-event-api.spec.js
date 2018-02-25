/**
 * Created by Sascha on 22.02.16.
 */
define(function (require) {

    var helpers = require('helpers');

    describe('element-dom-event-api', function () {

        it('should add DOM event listeners through element API', function (done) {

            var graphic = helpers.setupDefaultGraphic('box.svg', 'empty.config.json');

            graphic.on('ready', function () {

                var callback = jasmine.createSpy();

                graphic.element('rect').on('click', callback);

                helpers.trigger(Snap('#rect'), 'click');

                expect(callback).toHaveBeenCalled();
                done();
            });
        });

        it('should bubble DOM events to graphic', function (done) {

            var graphic = helpers.setupDefaultGraphic('box.svg', 'empty.config.json');

            graphic.on('ready', function () {

                var callback = jasmine.createSpy();
                var bubbleCallback = jasmine.createSpy();

                graphic.element('rect').on('click', callback);
                graphic.on('element.click', bubbleCallback);

                helpers.trigger(Snap('#rect'), 'click');

                expect(bubbleCallback).toHaveBeenCalled();
                done();
            });
        });

        it('should remove all DOM event listeners when graphic is destroyed', function (done) {

            var graphic = helpers.setupDefaultGraphic('box.svg', 'empty.config.json');

            graphic.on('ready', function () {

                var callback = jasmine.createSpy();
                var rect = Snap('#rect');

                graphic.element('rect').on('click', callback);
                graphic.destroy();

                helpers.trigger(rect, 'click');

                expect(callback).not.toHaveBeenCalled();
                done();
            });
        });
    });
});