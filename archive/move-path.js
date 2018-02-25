/**
 * Created with IntelliJ IDEA.
 * User: sascha
 * Date: 22.04.13
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */

define(['iag/client/runtime/transformation/transformation', 'iag/client/util/util'], function (Transformation, Util) {

    var MoveTransformation = function (config, runtime, document) {
        Transformation.call(this, config, runtime, document);
    };

    Util.extend(MoveTransformation, Transformation);

    MoveTransformation.prototype.init = function () {

        this.observeVariable(this.config.bindings.value);

        this.svg = Snap(window.document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        //this.svg = Snap($('svg:last').get(0));

        var path = '';

        $.each(this.config.path, function (i, node) {

            // Set positions
            //var position = this.toLocal({x: node[0], y: node[1]});
            //var matrix = document.contentLayer.transform().globalMatrix;
            //console.log(matrix);
            //var position = {x: matrix.x(node[0], node[1]), y: matrix.y(node[0],node[1])};
            var position = {x: node[0], y: node[1]};

            if (i == 0)
                path += 'M';
            else if (i == 1 && this.config.spline && this.config.path.length > 2)
                path += 'R';
            else if (i == 1)
                path += 'L';

            path += ' ' + position.x + ' ' + position.y;

        }.bind(this));

        this.spline = this.svg.path(path).attr({fill: 'none', strokeWidth: 2, stroke: '#000'});

        this.originalTransform = this.element.transform();
    };

    MoveTransformation.prototype.apply = function () {

        var variable = this.getVariable(this.config.bindings.value);

        if (!variable) return null;

        var value = variable.value;

        var pathLength = this.spline.getTotalLength();

        var ratio = pathLength / (variable.config.range.to - variable.config.range.from);

        var distance = (value - variable.config.range.from) * ratio;

        //don't move over the ends of the path
        if (distance < 0) distance = 0;
        if (distance > pathLength) distance = pathLength;

        var coordinates = this.spline.getPointAtLength(distance);

        var bbox = Util.getCombinedElementsBoundingBox(this.element);

        var center = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};

        var globalToLocalMatrix = this.element.transform().globalMatrix.invert();

        var localCenter = {
            x: globalToLocalMatrix.x(center.x, center.y),
            y: globalToLocalMatrix.y(center.x, center.y)
        };

        var localCoordinates = {
            x: globalToLocalMatrix.x(coordinates.x, coordinates.y),
            y: globalToLocalMatrix.y(coordinates.x, coordinates.y)
        };

        var diff = {x: localCoordinates.x - localCenter.x, y: localCoordinates.y - localCenter.y};

        var transform = this.element.transform().localMatrix.translate(diff.x, diff.y);

        this.element.transform(transform);
    };

    MoveTransformation.prototype.apply = function () {
        this.element.transform(this.originalTransform.localMatrix.toTransformString());
    };

    return MoveTransformation;
});