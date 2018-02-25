describe('ensure-pristine-transform', () => {

    const GRAPHIC = require('raw-loader!./archer.graphic.svg');
    const CONFIG = require('raw-loader!./archer.config.json');

    const archer = require('iag/client/client');
    const helpers = require('helpers');

    /**
     * Setup:
     * - 2 nested elements, outer and inner
     * - outer has a rotate transformation
     * - inner has a translate transformation
     * - rotate runs before translate
     * - the rotation implicitly changes the transform for inner before translate has run
     * - translate should request default value before rotate has run, so the value is memorized
     */
    it('should store pristine transform when using transformations on nested elements', done => {

        // Get pristine transform by loading graphic without config
        helpers.clear();

        let container = helpers.setupContainer();
        let graphic = archer.create(container[0]);

        graphic.document.load(GRAPHIC);

        const pristineValues = {
            outer: graphic.element('outer').getDefaultValue('transform'),
            inner: graphic.element('inner').getDefaultValue('transform')
        };

        graphic.destroy();

        // This time load config and check if pristine values differ after transformations have been run
        helpers.clear();

        container = helpers.setupContainer();
        graphic = archer.create(container[0]);

        graphic.load(GRAPHIC, CONFIG);

        graphic.setValue('direction', 0);
        graphic.setValue('movement', 0);

        graphic.on('scheduler.complete', () => {

            const compareValues = {
                outer: graphic.element('outer').getDefaultValue('transform'),
                inner: graphic.element('inner').getDefaultValue('transform')
            };

            expect(compareValues.outer.localMatrix).toEqual(pristineValues.outer.localMatrix);
            expect(compareValues.outer.totalMatrix).toEqual(pristineValues.outer.totalMatrix);
            expect(compareValues.outer.globalMatrix).toEqual(pristineValues.outer.globalMatrix);

            expect(compareValues.inner.localMatrix).toEqual(pristineValues.inner.localMatrix);
            expect(compareValues.inner.totalMatrix).toEqual(pristineValues.inner.totalMatrix);
            expect(compareValues.inner.globalMatrix).toEqual(pristineValues.inner.globalMatrix);

            done();
        });
    });
});