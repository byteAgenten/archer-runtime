/**
 * Created by roman on 05/03/15.
 */

define([], function () {

    var AutoPlay = function (transformation) {
        this.transformation = transformation;

        if (!this.transformation.getAnimationValue) {
            throw new Error('Transformation does not support auto play');
        }
    };

    AutoPlay.prototype.play = function () {

        if (this.animation) return;

        this.animate(true);
    };

    AutoPlay.prototype.animate = function (forward) {

        var start = this.transformation.variable.getThreshold('min').value;
        var end = this.transformation.variable.getThreshold('max').value;

        this.animation = $({value: forward ? start : end}).animate({value: forward ? end : start}, {

            duration: this.transformation.config.autoPlay.duration * 1000,

            step: this.step.bind(this),

            complete: function () {
                this.complete(forward);
            }.bind(this)
        });
    };

    AutoPlay.prototype.step = function (now) {
        this.transformation.apply(this.transformation.getAnimationValue(now));
    };

    AutoPlay.prototype.complete = function (forward) {

        if (this.transformation.config.autoPlay.yoyo
            && (this.transformation.config.autoPlay.loop || forward)) {

            this.animate(!forward);

        } else if (this.transformation.config.autoPlay.loop) {

            this.animate(true);

        } else {

            this.animation = null;
        }
    };

    AutoPlay.prototype.stop = function () {
        if (this.animation) {
            this.animation.stop();
            this.animation = null;
        }
    };

    return AutoPlay;
});