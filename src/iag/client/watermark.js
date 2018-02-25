var MIN_WIDTH = 200;
var MIN_HEIGHT = 200;

var svgData = require('./watermark.svg');

function create(graphicDocument) {

    var containerSize = graphicDocument.getViewBounds();

    // Do not show watermark if container size is below minimum size
    if (containerSize.width < MIN_WIDTH || containerSize.height < MIN_HEIGHT) return;

    var watermarkContainer = document.createElement('div');
    watermarkContainer.style.position = 'relative';
    watermarkContainer.style.height = 0;

    var watermarkLink = document.createElement('a');
    watermarkLink.setAttribute('href', 'https://archer.graphics');
    watermarkLink.setAttribute('target', '_');
    watermarkLink.setAttribute('title', 'Powered by Archer');
    watermarkLink.style.display = 'block';
    watermarkLink.style.position = 'absolute';
    watermarkLink.style.right = '0';
    watermarkLink.style.bottom = '0';
    watermarkLink.style.width = '60px';
    watermarkLink.style.height = '60px';
    watermarkLink.style.backgroundImage = 'url(' + svgData + ')';
    watermarkLink.style.backgroundSize = 'contain';

    watermarkContainer.appendChild(watermarkLink);
    graphicDocument.element.appendChild(watermarkContainer);
}

module.exports = {
    create: create
};
