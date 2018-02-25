var Util = {};

Util.getBoxPosition = function (box, center) {

    // Use 'center' as default value
    center || (center = 'center');

    // If center is not a string, assume that center is a position object
    if (typeof center !== 'string') return center;

    var x = box.x;
    var y = box.y;
    var width = box.width;
    var height = box.height;

    if (center == 'top-left') return { x: x, y: y };
    if (center == 'top') return { x: x + (width / 2), y: y };
    if (center == 'top-right') return { x: x + width, y: y };
    if (center == 'left') return { x: x, y: y + (height / 2) };
    if (center == 'right') return { x: x + width, y: y + (height / 2) };
    if (center == 'bottom-left') return { x: x, y: y + height };
    if (center == 'bottom') return { x: x + (width / 2), y: y + height };
    if (center == 'bottom-right') return { x: x + width, y: y + height };

    // Return 'center' as default
    return { x: x + (width / 2), y: y + (height / 2) };
};

Util.getCombinedElementsBoundingBox = function (elements, padding) {

    elements = elements.length ? elements : [elements];

    var combinedBbox = { x: Number.MAX_VALUE, y: Number.MAX_VALUE, x2: -Number.MAX_VALUE, y2: -Number.MAX_VALUE };

    // Find the combined bounding box of all elements after transformations
    elements.forEach(function (element) {

        var snapElm = Snap(element);
        // Use the faster native getBBox method instead of SnapSVG's
        var bbox = element.getBBox();
        bbox.x2 = bbox.x + bbox.width;
        bbox.y2 = bbox.y + bbox.height;

        var matrix = snapElm.transform().globalMatrix;

        var points = { x: [], y: [] };

        // top left
        points.x.push(matrix.x(bbox.x, bbox.y));
        points.y.push(matrix.y(bbox.x, bbox.y));

        // top right
        points.x.push(matrix.x(bbox.x2, bbox.y));
        points.y.push(matrix.y(bbox.x2, bbox.y));

        // bottom right
        points.x.push(matrix.x(bbox.x2, bbox.y2));
        points.y.push(matrix.y(bbox.x2, bbox.y2));

        // bottom left
        points.x.push(matrix.x(bbox.x, bbox.y2));
        points.y.push(matrix.y(bbox.x, bbox.y2));

        var x = Math.min.apply(null, points.x);
        var y = Math.min.apply(null, points.y);
        var x2 = Math.max.apply(null, points.x);
        var y2 = Math.max.apply(null, points.y);

        if (x < combinedBbox.x) combinedBbox.x = x;
        if (x < combinedBbox.y) combinedBbox.y = y;
        if (x2 > combinedBbox.x2) combinedBbox.x2 = x2;
        if (y2 > combinedBbox.y2) combinedBbox.y2 = y2;
    });

    if (padding) {
        combinedBbox.x -= padding;
        combinedBbox.y -= padding;
        combinedBbox.x2 += padding;
        combinedBbox.y2 += padding;
    }

    combinedBbox.width = combinedBbox.x2 - combinedBbox.x;
    combinedBbox.height = combinedBbox.y2 - combinedBbox.y;

    return combinedBbox;
};

module.exports = Util;
