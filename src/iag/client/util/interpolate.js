var colors = require('iag/client/util/colors');
var animate = require('iag/client/util/animate');

function ease(fac, easing) {
    easing = easing || animate.linear;
    return easing(fac);
}

function number(v1, v2, fac, easing) {
    return v1 + ((v2 - v1) * ease(fac, easing));
}

function point(v1, v2, fac, easing) {
    return {
        x: v1.x + ((v2.x - v1.x) * ease(fac, easing)),
        y: v1.y + ((v2.y - v1.y) * ease(fac, easing))
    };
}

function color(v1, v2, fac, easing) {

    var lowerColor = colors.color(v1);
    var upperColor = colors.color(v2);
    var interpolatedColor = colors.interpolateRgb(lowerColor, upperColor, ease(fac, easing));

    return colors.rgb2hex(interpolatedColor);
}

function text(v1) {
    return v1;
}

module.exports = {
    number: number,
    point: point,
    color: color,
    text: text
};
