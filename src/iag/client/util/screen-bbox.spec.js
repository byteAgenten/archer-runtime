var helpers = require('helpers');

var screenBBox = require('iag/client/util/screen-bbox');

describe('screen-bbox', function () {

    var graphicContainer;
    var graphic;
    var content;
    var element;

    beforeEach(function () {

        helpers.clear();

        var body = $('body');

        body.css({ overflow: 'auto' });

        // Add an offset of 10000px to document
        $('<div></div>').css({
            width: '200px',
            height: '10000px'
        }).appendTo('body');

        graphicContainer = $('<div></div>').css({
            width: '200px',
            height: '200px'
        }).appendTo('body');

        // Add scroll offset
        body.scrollTop(5000);

        graphic = Snap(200, 200).appendTo(graphicContainer[0]).attr('id', 'outer');

        // Move viewbox by 50,50; zoom to 200%
        graphic.attr('viewBox', '50 50 100 100');

        // Test within nested SVG, just like in document
        content = graphic.svg();

        // Element, to test bbox for, size: 50,50
        element = content.rect(0, 0, 50, 50);

        // Move element by 50,50 this should compensate for moving the viewbox by 50,50 and put the element back to 0,0
        element.transform(Snap.matrix().translate(50, 50));
    });

    it('should calculate position in screen coordinates', function () {

        var bbox = screenBBox(element.node);

        // Position should translated by 50,50, size isn't changed
        expect(bbox.x).toBe(0);
        expect(bbox.y).toBe(0);
    });

    it('should calculate size including all transforms + viewBox', function () {

        var bbox = screenBBox(element.node);

        expect(bbox.width).toBe(100);
        expect(bbox.height).toBe(100);
    });

    it('should calculate client coordinates', function () {

        var bbox = screenBBox(element.node);
        var containerClientRect = graphicContainer[0].getBoundingClientRect();

        expect(bbox.clientX).toBe(containerClientRect.left);
        expect(bbox.clientY).toBe(containerClientRect.top);
    });

    it('should calculate page coordinates', function () {

        var bbox = screenBBox(element.node);
        var offset = graphicContainer.offset();

        expect(bbox.pageX).toBe(offset.left);
        expect(bbox.pageY).toBe(offset.top);
    });
});
