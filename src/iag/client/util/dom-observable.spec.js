var helpers = require('helpers');

var Observable = require('iag/client/util/observable');
var DomObservable = require('iag/client/util/dom-observable');

describe('dom-observable', function () {

    var svgElement;

    beforeEach(function () {
        svgElement = helpers.setupSvg();
    });

    it('should emit DOM events', function () {

        var observable = DomObservable(svgElement);
        var callback = jasmine.createSpy();

        observable.on('click', callback);

        helpers.trigger(svgElement, 'click');

        expect(callback).toHaveBeenCalled();
    });

    it('should pass arguments', function () {

        var observable = DomObservable(svgElement);
        var callback = jasmine.createSpy();

        observable.on('click', callback);

        helpers.trigger(svgElement, 'click');

        expect(callback).toHaveBeenCalled();
        expect(callback.calls.first().args[0]).toBe(svgElement.node);
        expect(callback.calls.first().args[1]).toEqual(jasmine.any(MouseEvent));
    });

    it('should remove DOM listeners', function () {

        var observable = DomObservable(svgElement);
        var callback = jasmine.createSpy();

        observable.on('click', callback);
        observable.off('click', callback);

        helpers.trigger(svgElement, 'click');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should remove all DOM listeners on destroy', function () {

        var observable = DomObservable(svgElement);
        var callback = jasmine.createSpy();

        observable.on('click', callback);
        observable.on('mouseover', callback);
        observable.on('mouseout', callback);
        observable.destroy();

        helpers.trigger(svgElement, 'click');
        helpers.trigger(svgElement, 'mouseover');
        helpers.trigger(svgElement, 'mouseout');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should only create one DOM listener', function () {

        var observable = DomObservable(svgElement);
        var callback1 = jasmine.createSpy();
        var callback2 = jasmine.createSpy();
        var callback3 = jasmine.createSpy();

        observable.on('click', callback1);
        observable.on('click', callback2);
        observable.on('click', callback3);

        helpers.trigger(svgElement, 'click');

        expect(callback1).toHaveBeenCalled();
        expect(callback1.calls.count()).toBe(1);
        expect(callback2).toHaveBeenCalled();
        expect(callback2.calls.count()).toBe(1);
        expect(callback3).toHaveBeenCalled();
        expect(callback3.calls.count()).toBe(1);
    });

    it('should bubble DOM events', function () {

        var level1 = Observable();
        var level2 = Observable(level1, 'level1');
        var level3 = DomObservable(svgElement, level2, 'level3');

        var callback = jasmine.createSpy();
        var bubbleCallback = jasmine.createSpy();

        level3.on('click', callback);
        level1.on('level3.click', bubbleCallback);

        helpers.trigger(svgElement, 'click');

        expect(callback).toHaveBeenCalled();
        expect(bubbleCallback).toHaveBeenCalled();
        expect(bubbleCallback.calls.count()).toBe(1);
        expect(bubbleCallback.calls.first().args[0]).toBe(svgElement.node);
        expect(bubbleCallback.calls.first().args[1]).toEqual(jasmine.any(MouseEvent));
    });
});
