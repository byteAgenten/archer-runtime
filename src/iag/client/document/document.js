var Observable = require('iag/client/util/observable');
var assert = require('iag/client/util/assert');
var _ = require('iag/client/util/language-utils');

function Document() {
}

function document(element, graphic) {

    var instance = new Document();
    var observable = Observable(graphic, 'document');

    _.assign(instance, observable);

    var contentLayer;
    var assetsRoot;
    var documentBounds;

    initialize();

    function initialize() {

        // Clear container
        while (element.firstChild) element.removeChild(element.firstChild);

        // Create content layer
        // NOTE: Order is important here, first add SVG element to DOM, then create paper

        // Create content layer fragment
        var layer = Snap();

        // Add to container
        layer.appendTo(element);

        // Create paper from fragment
        // Note that instead of using sizes of 100% the size is set manually in view, this allows the view to
        // execute SVG resize and viewport update directly after another which avoids jumping/flickering of the content
        contentLayer = Snap(layer.node);
        contentLayer.attr({
            // Prevent drawing outside of container - should be browser default, but better be safe
            overflow: 'hidden',
            // Display as block element, otherwise would display as inline which creates a vertical scroll overflow
            // when used with `height: 100%` in a block container
            // Displaying as block seems to have no negative consequences and works in all majors browsers across
            // Windows and OS X
            display: 'block'
        });

        documentBounds = null; // Explicit document bounds
    }

    function destroy() {

        contentLayer.clear();
        contentLayer = null;
        element = null;
    }

    /**
     * Removes all existing content and appends a new SVG as content
     * If content is an SVG element then try to read document size from its viewBox or width/height attributes
     * @param content Markup or DOM node that must be or contain a SVG node
     */
    function load(content) {

        clear();

        assert(!!content, 'Content must not be null');

        // Parse content
        content = getFragment(content);

        // Find root SVG element, wrap in Snap.Element
        var svgRoot;

        // Make sure the node is wrapped as Snap.Element
        if (content.node instanceof SVGSVGElement) svgRoot = Snap(content.node);
        if (!svgRoot) svgRoot = content.select('svg');

        assert(!!svgRoot, 'Content must be or contain an SVG element');

        documentBounds = getDocumentBounds(svgRoot);

        append(svgRoot);
    }

    function append(content, to) {

        content = getFragment(content);
        to = to || contentLayer;

        // Prepare content for display
        prepareContent(content);

        // If content is a parsed document fragment then unwrap into Snap elements
        if (content.node instanceof DocumentFragment) {

            // Get child elements of the fragment
            var fragmentContents = content.node.children.map(getFragment);

            // Add child elements
            fragmentContents.forEach(function (elem) {
                contentLayer.append(elem, to);
            });

        } else {
            // Otherwise we assume we have a single Snap Element and just add it
            contentLayer.append(content, to);
        }

        observable.emit('contentChange');
    }

    function remove(el) {

        el = getFragment(el);
        el.remove();

        observable.emit('contentChange');
    }

    function clear() {

        contentLayer.clear();

        observable.emit('contentChange');
    }

    function find(query) {
        return contentLayer.select(query);
    }

    function wrap(el) {
        return getFragment(el);
    }

    function get(elementOrQuery) {
        // Either execute query or return Snap wrapper for element
        return typeof elementOrQuery === 'string' ? find(elementOrQuery) : wrap(elementOrQuery);
    }

    function getElement(elementId) {
        return find('#' + escapeIdSelector(elementId));
    }

    function getElementByPoint(x, y) {
        return Snap.getElementByPoint(x, y);
    }

    function setAssetRoot(root) {

        // Make sure path ends with a slash
        if (root && root.length && root.charAt(root.length - 1) != '/') {
            root += '/';
        }

        assetsRoot = root;
    }

    function setDocumentBounds(bounds) {

        if (bounds) {

            var x = parseFloat(bounds.x) || 0;
            var y = parseFloat(bounds.y) || 0;
            var width = parseFloat(bounds.width) || 0;
            var height = parseFloat(bounds.height) || 0;

            documentBounds = {
                x: x,
                y: y,
                width: width,
                height: height
            };

        } else {
            documentBounds = null;
        }
    }

    /**
     * Modifies the content so it gets correctly displayed in the client container
     * @param fragment
     */
    function prepareContent(fragment) {

        // Nested SVGs have a default viewBox that may clip its content if an outer SVG, like our content layer
        // container, specifies a smaller viewBox. The solution is to set the nested SVGs overflow to visible
        // See answer here: http://stackoverflow.com/a/9164181
        // Remove explicit viewBox as they may conflict with our zoom/move handling - nested SVG viewBoxes are not
        // supported right now
        var svgNodes = fragment.selectAll('svg');

        if (fragment.node instanceof SVGSVGElement) svgNodes.push(fragment);

        svgNodes.forEach(function (svgNode) {
            svgNode.attr('overflow', 'visible');
            svgNode.node.removeAttribute('viewBox');
        });

        // Translate image URLs so they point to the location specified through the assets root
        fragment.selectAll('image').forEach(function (image) {
            var hrefValue = image.attr('xlink:href');

            image.attr('xlink:href', translateAssetUrl(hrefValue));
        });
    }

    var PROTOCOL_REGEX = /[\w\d.+-]+:\/\//;

    function translateAssetUrl(url) {

        // Skip if there is no href
        // Skip if url uses a protocol (file, http, data, ...)
        if (!_.isString(url)) return url;
        if (PROTOCOL_REGEX.test(url)) return url;

        var assetName = extractAssetName(url);

        return assetsRoot ? assetsRoot + assetName : assetName;
    }

    function extractAssetName(url) {

        var pathParts = url.split(/\//);
        var fileName = pathParts[pathParts.length - 1];

        return fileName;
    }

    function getContentBounds() {

        var bounds = {};
        var offset;
        var sizes;

        // Use explicit size if available or use implicit content bounds from content layer
        if (documentBounds) {
            offset = sizes = documentBounds;
        } else {
            offset = sizes = contentLayer.getBBox();
        }

        bounds.x = offset.x;
        bounds.y = offset.y;
        bounds.width = sizes.width;
        bounds.height = sizes.height;
        bounds.x2 = bounds.x + bounds.width;
        bounds.y2 = bounds.y + bounds.height;

        return bounds;
    }

    function getViewBounds() {

        var width = pixelSize(getComputedStyle(element, 'width'));
        var height = pixelSize(getComputedStyle(element, 'height'));

        return {
            width: width,
            height: height
        };
    }

    // API
    _.assign(instance, {
        destroy: destroy,
        get element() {
            return element;
        },
        get contentLayer() {
            return contentLayer;
        },
        // Modify
        load: load,
        append: append,
        remove: remove,
        clear: clear,
        // Query
        find: find,
        wrap: wrap,
        get: get,
        getElement: getElement,
        getElementByPoint: getElementByPoint,
        getContentBounds: getContentBounds,
        getViewBounds: getViewBounds,
        translateAssetUrl: translateAssetUrl,
        extractAssetName: extractAssetName,
        // Config
        setAssetRoot: setAssetRoot,
        setDocumentBounds: setDocumentBounds
    });

    return instance;
}

function getFragment(markupOrElement) {

    if (!markupOrElement) return null;
    if (markupOrElement.node) return markupOrElement; // Assume we already have a Snap wrapper
    if (typeof markupOrElement === 'string') return Snap.parse(markupOrElement);

    return Snap(markupOrElement);
}

function getDocumentBounds(svg) {

    var bounds;

    // If viewbox is specified then use that as content bounds
    var viewBox = svg.attr('viewBox');

    if (viewBox) {
        bounds = {
            x: viewBox.x,
            y: viewBox.y,
            width: viewBox.width,
            height: viewBox.height
        };

        return bounds;
    }

    // Otherwise try to read bounds from width/height, but only if they are specified in pixels
    var width = pixelSize(svg.attr('width'));
    var height = pixelSize(svg.attr('height'));

    if (width && height) {
        bounds = {
            x: 0,
            y: 0,
            width: width,
            height: height
        };

        return bounds;
    }

    // Otherwise we can not determine explicit bounds, document should use implicit content bounds (bbox)
    return bounds;
}

function getComputedStyle(node, attr) {
    return node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyValue(attr);
}

function pixelSize(attributeValue) {

    var ACCEPTABLE_UNIT_REGEXP = /^[\d.]+(px)?$/;

    if (ACCEPTABLE_UNIT_REGEXP.test(attributeValue)) {
        return parseFloat(attributeValue);
    }

    return null;
}

function escapeIdSelector(id) {
    return id ? id.replace(/(#|:|\.|\[|]|,)/g, '\\$1') : null;
}

module.exports = document;
