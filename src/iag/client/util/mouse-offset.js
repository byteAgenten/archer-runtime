module.exports = function mouseOffset(element, event) {

    var rect = element.getBoundingClientRect();

    var offsetX = event.pageX - rect.left - window.pageXOffset;
    var offsetY = event.pageY - rect.top - window.pageYOffset;

    return {
        x: offsetX,
        y: offsetY
    };
};
