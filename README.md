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

* [Basic workflow tutorial](https://wiki.archer.graphics/display/ARCHER/Basic+Workflow+Tutorial)
* [Runtime guide](https://wiki.archer.graphics/display/ARCHER/Runtime+Guide)

## Editor
You can download a free version of the editor here:
* [MacOS](https://itunes.apple.com/de/app/archer-editor/id1154423656?mt=12)
* [Windows](https://www.microsoft.com/en-us/store/p/archer-editor-value-driven-graphics/9nblggh438sn)

 
## Examples
You can find several examples using the archer runtime at
**[codepen.io](https://codepen.io/archer-graphics/)**

Another place for exploring and playing with some archer graphics is the
**[Archer Cloud](https://cloud.archer.graphics/host)**



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
