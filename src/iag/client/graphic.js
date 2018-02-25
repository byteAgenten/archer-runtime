var _ = require('iag/client/util/language-utils');
var Observable = require('iag/client/util/observable');
var Document = require('iag/client/document/document');
var View = require('iag/client/view/view');
var Scheduler = require('iag/client/runtime/scheduler');
var Runtime = require('iag/client/runtime/runtime');
var Logger = require('iag/client/util/logger');
var ajax = require('iag/client/util/ajax');
var Settings = require('iag/client/settings');
var Watermark = require('iag/client/watermark');

var log = Logger('archer.graphic');

function Graphic() {
}

function graphic(element) {

    var instance = new Graphic();
    var observable = Observable();
    _.assign(instance, observable);

    var document = instance.document = new Document(element, instance);
    var view = instance.view = new View(instance);
    var scheduler = instance.scheduler = new Scheduler(instance);
    var runtime = instance.runtime = new Runtime(instance);

    var settings = Settings();

    Watermark.create(document);

    function loadUrl(markupUrl, configUrl) {

        var error = false;
        var markup;
        var config;

        ajax(markupUrl, function (request) {
            if (ajax.invalidResponse(request)) {
                error = true;
            }
            markup = request;
            complete();
        });

        ajax(configUrl, function (request) {
            if (ajax.invalidResponse(request)) {
                error = true;
            }
            config = request;
            complete();
        });

        function complete() {
            if (!markup) return;
            if (!config) return;

            if (error) {
                log.error('Could not load graphic files');
                setTimeout(observable.emit.bind(null, 'error')); // Delay so user can add listener
                return;
            }

            load(markup.response, config.response);
        }
    }

    function load(markupOrDom, config) {

        try {
            if (typeof config === 'string') {
                config = JSON.parse(config);
            }

            if (config.settings) setSettings(config.settings);

            document.load(markupOrDom);
            runtime.load(config);
            setTimeout(observable.emit.bind(null, 'ready')); // Delay so user can add listener

        } catch (e) {
            log.error('Error initializing graphic', e);
            observable.emit('error');
        }
    }

    function setSettings(options) {
        settings = Settings(options);
        applySettings();
    }

    function applySettings() {
        // Image quality
        document.element.style['image-rendering'] = settings.imageRendering == 'speed' ? 'pixelated' : 'auto';
    }

    function destroy() {
        document.destroy();
        view.destroy();
        runtime.destroy();
        scheduler.destroy();
        observable.destroy();
    }

    // API
    _.assign(instance, {
        loadUrl: loadUrl,
        load: load,
        get config() {
            return runtime.config;
        },
        get settings() {
            return settings;
        },
        setSettings: setSettings,
        setAssetRoot: document.setAssetRoot,
        destroy: destroy,
        element: runtime.getElement,
        variable: runtime.getVariable,
        getValue: runtime.getValue,
        setValue: runtime.setValue,
        logger: Logger
    });

    return instance;
}

module.exports = graphic;
