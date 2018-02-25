module.exports = function calculateScreenBBox(element) {

    // Screen bounds
    // Position and size in pixels including element and viewBox transforms
    var screenBounds = element.getBoundingClientRect();

    // Position relative to container
    var container = element.farthestViewportElement || element;
    var containerScreenBounds = container.getBoundingClientRect();

    var relativePosition = {
        left: screenBounds.left - containerScreenBounds.left,
        top: screenBounds.top - containerScreenBounds.top
    };

    // Position relative to document
    var pagePosition = {
        left: screenBounds.left + window.pageXOffset,
        top: screenBounds.top + window.pageYOffset
    };

    return {
        x: relativePosition.left,
        y: relativePosition.top,
        width: screenBounds.width,
        height: screenBounds.height,
        clientX: screenBounds.left,
        clientY: screenBounds.top,
        pageX: pagePosition.left,
        pageY: pagePosition.top
    };
};
