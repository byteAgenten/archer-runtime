# Archer Runtime

The Archer Runtime is a lightweight Open Source JavaScript Library for SVG transformations and interactions with an intuitive API.

This JavaScript Runtime adds an abstraction level for manipulating SVG graphics.

The basic concept is that you define variables with a specified value range and define how certain graphic elements shall be transformed (translated, rotated, scaled, …) when the value of the variable changes.

It was designed to work with the Archer Editor where you can visually define the transformations of the SVG. As a result of the behaviour definition within the Archer Editor, a configuration file formatted in JSON is created. The JSON plus the SVG and the Archer JS Runtime are all you need to trigger the graphics behaviour with just a single line of code:

```jsx
graphic.setValue('temperature', 26.8);
```


## Documentation
You can find detailed information about the archer graphics platform at **[http://archer.graphics](http://archer.graphics)**


## Editor
You can download the Archer Editor here:
* [MacOS](https://apps.apple.com/de/app/archer-editor-pro/id1332609371?l=en&mt=12)
* [Windows](https://www.microsoft.com/en-us/p/archer-editor-pro-value-driven-graphics/9mxrmvz3wldj)

 
## Examples
You can find several examples using the archer runtime at
**[codepen.io](https://codepen.io/archer-graphics/)**


## Build
### Dependencies:
For building the library file you need to have [NodeJS](http://nodejs.org/download/) installed.


### Setup:
Open a terminal window and navigate to the root folder of the project. Install the required npm modules by executing the following commands. 

*In case you are woking on linux or MacOS you might have to write **`sudo`** in front of **`npm`**.*
```shell 
npm install grunt-cli -g
npm install bower -g
npm install lodash-cli -g
npm install webpack -g
npm install
bower install
```
### Create build:
Execute grunt for building the library file.
```shell 
grunt
```
## Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Archer Graphic</title>
</head>
<body>

<div id="container"></div>

<script src='archer.min.js'></script>
<script language='javascript' type='text/javascript'>

    /**
     * Root location where your interactive graphic is stored.
     * Leave empty to resolve paths relative from this HTML.
     * Can also contain an absolute URL to the server where your graphic is stored, for example:
     * http://my-domain.com/graphics/my-graphic/
     */
    var rootUrl = '';

    /**
     * Location of the assets folder, by default resolved relative from root URL
     */
    var assetUrl = rootUrl + 'assets';

    /**
     * Location of the SVG file, by default resolved relative from root URL
     */
    var graphicUrl = rootUrl + 'archer.graphic.svg';

    /**
     * Location of the graphic configuration file, by default resolved relative from root URL
     */
    var configUrl = rootUrl + 'archer.config.json';

    /**
     * The container HTML element in which to display the graphic
     */
    var container = document.getElementById('container');

    // Create a graphic instance over the container
    var graphic = archer.create(container);

    // Tell the graphic where assets (e.g. images) are located
    graphic.document.setAssetRoot(assetUrl);

    // Load graphic and configuration
    graphic.loadUrl(graphicUrl, configUrl);

    // Wait until files are loaded
    graphic.on('ready', function () {

        // Make graphic fit into container bounds
        graphic.view.zoomToFit();

        // Enable zoom / pan with mouse
        graphic.view.enableMouse(true, true);

        // Set variable values
        graphic.setValue('temperature', 27.8);
    });

</script>

</body>
</html>
```


# Archer Runtime Guide

## Graphic initialization

Create a new graphic instance by calling create with a DOM element as argument.

```html
var containerElement = document.getElementById('container');

var graphic = archer.create(containerElement);
```

You can load a graphic using the built-in AJAX loader by calling loadUrl(svgFileUrl, configFileUrl).

```html
graphic.loadUrl('archer.graphic.svg', 'archer.config.json');
```

Because loadUrl works asynchronously you can use the ready event to get notified when the graphic has finished loading. You have to wait for this event before you start using other runtime features like changing variable values or creating DOM event listeners.

```html
graphic.on('ready', function () {
    console.log('Graphic is ready');
});
```

Use the error event to get notified in case the graphic files could not be loaded.

```html
graphic.on('error', function () {
    console.log('Could not load graphic');
});
```

If you want to load the SVG markup and config JSON manually or create them from scratch you can use load(svgMarkup, configJson).

```html
var svgMarkup = '...';
var configJson = '...';

graphic.load(svgMarkup, configJson);
```

Both load and loadUrl can be called multiple times, in case you want to change the graphic during runtime.
If your graphic is using assets you have to specify the path in which the asset files can be found using setAssetRoot(baseUrl). All asset files need to be in the same path.

NOTE: This has to be called before loading the graphic using either load or loadUrl.

```html
graphic.setAssetRoot('assets');
```

When you don't need to the graphic anymore you can dispose of it by calling destroy.

```html
graphic.destroy();
```

## Value manipulation

You can change a variable value using setValue(variableName, value). This method is used for all types of variables (number, text and boolean).

```html
graphic.setValue('speed', 123);
graphic.setValue('status', 'pending');
graphic.setValue('visible', false);
```

Optionally you can provide a pre-formatted value using a third parameter formattedValue. This value is only used in text transformations and allows you to display a more user-friendly string instead of the raw input value.

```html
var speed = 123.456789;
var speedFormatted = speed.toFixed(2);

graphic.setValue('speed', speed, speedFormatted);
```

To retrieve the current value of a variable use getValue(variableName).

```html
var speedValue = graphic.getValue('speed');

console.log('Speed: ' + speedValue);
```

## Events
### DOM events

You can listen for DOM events by using on(eventType, callback) on an element object. The callback parameters are the native DOM element and DOM event. You can listen for any native DOM event.

NOTE: The graphic.element accessor only accepts an element ID and returns null if there is no element with the specified ID.

```html
var element = graphic.element('elementId');

element.on('click', logDomEvent);
element.on('mouseover', logDomEvent);
element.on('mouseout', logDomEvent);
element.on('mousemove', logDomEvent);

function logDomEvent(domElement, domEvent) {
    console.log('Event: ' + domEvent.type + ', Element: ' + domElement.id);
}
```

You can also listen to all registered events of a type by creating a listener on the graphic object and using the static prefix element for the event type. This listener is called when that event occurs in any element that has a listener for that event. That includes events that were configured in the Archer Editor.

```html
graphic.element('element1').on('click', logDomEvent);
graphic.element('element2').on('click', logDomEvent);
graphic.element('element3').on('click', logDomEvent);

graphic.on('element.click', function (domElement) {
    console.log(['element1', 'element2', 'element3'].indexOf(domElement.id) >= 0); // true
});
```

All DOM events are enhanced with a bbox object that contains information about the size and position of the target element:

x Horizontal offset in pixels from the graphic container
y Vertical offset in pixels from the graphic container
clientX Horizontal offset in pixels from the browsers client area
clientY Vertical offset in pixels from the browsers client area
pageX Horizontal offset in pixels from the HTML document
pageY Vertical offset in pixels from the HTML document
width Width of the element in pixels
height Height of the element in pixels

```html
graphic.element('elementId').on('click', function (domElement, mouseEvent) {

    var bbox = mouseEvent.bbox;

    console.log('Offset to graphic container: ' + bbox.x + ',' + bbox.y);
    console.log('Offset to client area: ' + bbox.clientX + ',' + bbox.clientY);
    console.log('Offset to document: ' + bbox.pageX + ',' + bbox.pageY);
    console.log('Size: ' + bbox.width + ',' + bbox.height);
});
```

To remove an event listener use off(eventType, callback). Make sure that you pass the same function reference that you passed to on.

```html
function onClick(domElement) {}

graphic.element('elementId').on('click', onClick);
graphic.element('elementId').off('click', onClick);
```

Alternatively each created listener returns a function to remove that listener.

```html
var removeListener = graphic.element('elementId').on('click', onClick);

removeListener();
```

### Runtime events

Using the same API you can also listen for events that the runtime dispatches itself, such as when a variable changed or an element was rendered.
The following events are available:

ready The graphic was successfully loaded
error The graphic could not be loaded
variable.change A variable value has changed, causing a new update cycle
scheduler.start A new update cycle has started
scheduler.transform All transformations have recalculated during an update cycle
element.render A single element was rendered during an update cycle
scheduler.render All elements were rendered during an update cycle
scheduler.complete Update cycle was completed

```html
graphic.on('ready', function () {
    console.log('Graphic loaded successfully');
});

graphic.on('error', function () {
    console.log('Graphic could not be loaded');
});

graphic.on('variable.change', function (variable, value, formattedValue) {
    console.log(variable.name + ' changed: ' + value + ',' + formattedValue);
});

graphic.on('element.render', function (domElement) {
    console.log(domElement.id + ' updated');
});

graphic.on('scheduler.complete', function () {
    console.log('Graphic updated');
});
```

## Viewport
### Viewport manipulation

To move the viewport you can use moveBy(dx, dy, animate). The dx and dy parameters specify the horizontal and vertical translation in SVG units. The animate flag is an optional parameter that specifies whether the resulting viewport change should be animated. The default value is false in which case the change happens instantaneous. This parameter is used in many of the following operations and has always the same effect.

```html
graphic.view.moveBy(25, 50, true);
```

To center the viewport on a specific point you can use centerAt(x, y, animate) where x and y specify the horizontal and vertical center in SVG units.

```html
graphic.view.centerAt(100, 100, true);
```

There are several methods for changing the zoom level:

zoomTo(zoomLevel, target, animate) Set an explicit zoom level
zoomIn(factor, target, animate) Increase zoom level by a specified factor
zoomOut(factor, target, animate) Decrease zoom level by a specified factor

The target is an optional parameter that you can use if you want to zoom in on a specific point. The parameter value must be an object with the shape {x, y} where x and y are specified in SVG units. By default, or by passing null, the center of the graphic container is used.

```html
graphic.view.zoomTo(2); // Set zoom to 200%
graphic.view.zoomTo(0.5, {x: 50, y: 50}, true); // Set zoom to 50%

graphic.view.zoomIn(1.25); // Increase zoom by 25%
graphic.view.zoomOut(2, {x: 50, y: 50}, true); // Decrease zoom by 50%
```

To reset the graphic to its original size you can use zoomToOriginal(animate). The viewport will be centered on the center of the graphic.

```html
graphic.view.zoomToOriginal(true);
```

You can also make the graphic fit its container bounds by using zoomToFit(padding, animate). The padding parameter specifies the distance between the graphic bounds and the container bounds. The viewport will be centered on the center of the graphic.

```html
graphic.view.zoomToFit(10, true);
```

You can make the viewport surround an element's bounding box by using zoomToElements(elements, padding, animate). elements can either be a single DOM element or an Array of DOM elements. When using an Array the viewport encompasses the elements' combined bounding box. The padding parameter specifies the distance between the elements' combined bounding box and the graphic container.

```html
graphic.element('elementId').on('click', function (domElement) {
    graphic.view.zoomToElements(domElement, 10, true);
});
```

## User interaction

The runtime allows for changing the viewport using the mouse. To enable mouse interaction use enableMouse(panEnabled, zoomEnabled). If panEnabled is true then clicking and dragging the mouse will pan the viewport. If zoomEnabled is true then using the mouse wheel will zoom the viewport.

```html
graphic.view.enableMouse(true, true);
```

Both features can be turned off at any time by passing false as parameters.

```html
graphic.view.enableMouse(false, false);
```

## Container resizing

If the graphic container has resized then the runtime needs to be notified of that change. Use resize to reinitialize the view to the new container bounds.

```html
containerElement.style['width'] = '500px';
containerElement.style['height'] = '500px';

graphic.view.resize();
```

This may be necessary when the window size changes or your layout uses resizable panels.

```html
window.addEventListener('resize', function () {
    graphic.view.resize();
});
```
