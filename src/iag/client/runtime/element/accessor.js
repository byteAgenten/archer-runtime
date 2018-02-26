/**
 * 
 * Copyright (c) 2018 - present, byteAgenten GmbH, Germany. All rights reserved.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ACCESSORS = {
    transform: transformAccessor,
    bbox: bboxAccessor,
    text: textContentAccessor,
    href: hrefAccessor,
    fill: colorAttributeAccessor('fill'),
    stroke: colorAttributeAccessor('stroke'),
    'stroke-width': numberAttributeAccessor('stroke-width'),
    opacity: numberAttributeAccessor('opacity'),
    display: textAttributeAccessor('display'),
    visibility: textAttributeAccessor('visibility')
};

/**
 * Creates an accessor that gives read/write access to an element attribute
 * @param attribute
 * @param domElement
 * @param document
 * @returns {get, set}
 */
function accessor(domElement, document, attribute) {

    var AttributeAccessor = ACCESSORS[attribute];

    if (!AttributeAccessor) throw new Error('Unsupported attribute access: ' + attribute);

    return AttributeAccessor(domElement, document);
}

function transformAccessor(domElement) {
    return {
        get: function () {
            return domElement.transform();
        },
        set: function (value) {
            domElement.transform(value.localMatrix);
            // NOTE: CSS transforms basically work as expected, however they can not be queried in nw.js 0.12.3 using
            // either getComputedStyle or SnapElement.transform()
            // While of no consequence for the client, in the editor this has the effect that canvas editors can not
            // work with previously transformed elements
            // domElement.node.style['transform'] = value.localMatrix.toString();
        }
    };
}

function bboxAccessor(domElement) {
    return {
        get: function () {
            return domElement.node.getBBox();
        },
        set: function () {
            // Setting bbox is not allowed
        }
    };
}

function textContentAccessor(domElement) {
    return {
        get: function () {
            return domElement.node.textContent;
        },
        set: function (value) {
            domElement.node.textContent = value;
        }
    };
}

function hrefAccessor(domElement, document) {
    return {
        get: function () {
            var url = domElement.attr('xlink:href');
            var assetName = document.extractAssetName(url);
            return assetName;
        },
        set: function (value) {

            !value || (value = document.translateAssetUrl(value));

            if (value != null) {
                domElement.attr('xlink:href', value || '');
            } else {
                domElement.node.removeAttribute('xlink:href');
                domElement.node.removeAttribute('href');
            }
        }
    };
}

function textAttributeAccessor(attributeName) {

    return function (domElement) {
        return {
            get: function () {
                // NOTE: Snap already returns computed styles (inherited, referenced, ...)
                return domElement.attr(attributeName);
            },
            set: function (value) {
                domElement.node.style[attributeName] = value;
            }
        };
    };
}

function colorAttributeAccessor(attributeName) {

    return function (domElement) {
        return {
            get: function () {
                // NOTE: Snap already returns computed styles (inherited, referenced, ...)
                var colorString = domElement.attr(attributeName);
                var snapColor = Snap.color(colorString);
                return snapColor.hex;
            },
            set: function (value) {
                domElement.node.style[attributeName] = value;
            }
        };
    };
}

function numberAttributeAccessor(attributeName) {

    return function (domElement) {
        return {
            get: function () {
                // Snap will always return strings and sizes may have units, like "1px"
                // We will just ignore the unit and assume the value is in user units
                var value = domElement.attr(attributeName);
                value = value.replace(/[^0-9.]+/g, '');
                value = parseFloat(value);

                return value;
            },
            set: function (value) {
                domElement.node.style[attributeName] = value;
            }
        };
    };
}

module.exports = accessor;
