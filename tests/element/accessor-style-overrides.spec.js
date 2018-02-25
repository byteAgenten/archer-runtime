/**
 * Created by Sascha on 25.02.16.
 */
define(function (require) {

    var helpers = require('helpers');

    describe('element-accessor-style-overrides', function () {

        it('should override attribute styles', function (done) {

            var graphic = helpers.setupDefaultGraphic('base/tests/element/accessor-style-overrides.svg', 'base/tests/element/accessor-style-overrides.json');

            graphic.on('ready', function () {

                graphic.runtime.setValue('test', 'test');

                graphic.scheduler.on('complete', function () {

                    var rect = Snap('#rect-attribute-styles');

                    expect(Snap.color(rect.attr('fill')).hex).toBe('#ff0000');
                    expect(Snap.color(rect.attr('stroke')).hex).toBe('#ff0000');
                    expect(rect.attr('stroke-width')).toBe('10px');
                    expect(rect.attr('opacity')).toBe('0.5');

                    done();
                });
            });
        });

        it('should override inline css styles', function (done) {

            var graphic = helpers.setupDefaultGraphic('base/tests/element/accessor-style-overrides.svg', 'base/tests/element/accessor-style-overrides.json');

            graphic.on('ready', function () {

                graphic.runtime.setValue('test', 'test');

                graphic.scheduler.on('complete', function () {

                    var rect = Snap('#rect-inline-css-styles');

                    expect(Snap.color(rect.attr('fill')).hex).toBe('#ff0000');
                    expect(Snap.color(rect.attr('stroke')).hex).toBe('#ff0000');
                    expect(rect.attr('stroke-width')).toBe('10px');
                    expect(rect.attr('opacity')).toBe('0.5');

                    done();
                });
            });
        });

        it('should override class css styles', function (done) {

            var graphic = helpers.setupDefaultGraphic('base/tests/element/accessor-style-overrides.svg', 'base/tests/element/accessor-style-overrides.json');

            graphic.on('ready', function () {

                graphic.runtime.setValue('test', 'test');

                graphic.scheduler.on('complete', function () {

                    var rect = Snap('#rect-class-css-styles');

                    expect(Snap.color(rect.attr('fill')).hex).toBe('#ff0000');
                    expect(Snap.color(rect.attr('stroke')).hex).toBe('#ff0000');
                    expect(rect.attr('stroke-width')).toBe('10px');
                    expect(rect.attr('opacity')).toBe('0.5');

                    done();
                });
            });
        });

    });
});