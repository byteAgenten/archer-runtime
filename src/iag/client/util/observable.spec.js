var Observable = require('iag/client/util/observable');

describe('observable', function () {

    it('should call listeners', function () {

        var observable = Observable();
        var callback1 = jasmine.createSpy();
        var callback2 = jasmine.createSpy();
        var callback3 = jasmine.createSpy();

        observable.on('test', callback1);
        observable.on('test', callback2);
        observable.on('test', callback3);
        observable.emit('test');

        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        expect(callback3).toHaveBeenCalled();
    });

    it('should pass arguments', function () {

        var observable = Observable();
        var callback = jasmine.createSpy();

        observable.on('test', callback);
        observable.emit('test', 'text', 123);

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith('text', 123);
    });

    it('should remove listeners', function () {

        var observable = Observable();
        var callback = jasmine.createSpy();

        observable.on('test', callback);
        observable.off('test', callback);
        observable.emit('test');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should remove all listeners on destroy', function () {

        var observable = Observable();
        var callback = jasmine.createSpy();

        observable.on('test', callback);
        observable.destroy();

        observable.emit('test');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should bubble events', function () {

        var level1 = Observable();
        var level2 = Observable(level1);
        var level3 = Observable(level2);
        var callback = jasmine.createSpy();

        level1.on('test', callback);
        level3.emit('test', 'text', 123);

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith('text', 123);
    });

    it('should add prefix for bubbling events', function () {

        var level1 = Observable();
        var level2 = Observable(level1, 'level2');
        var level3 = Observable(level2, 'level3');
        var callback = jasmine.createSpy();

        level1.on('level3.test', callback);
        level3.emit('test', 'text', 123);

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith('text', 123);
    });

});
