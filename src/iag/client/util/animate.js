// This is basically a wrapper for mina.animate which overrides the stop function behaviour
// Stop in mina always calls set function, which we do not want
function animate(from, to, setter, duration, easing, callback) {

    var baseAnim = Snap.animate(from, to, setter, duration, easing, callback);

    var anim = Object.create(baseAnim);

    anim.stop = function () {
        baseAnim.set = function () {
        }; // Null throws error
        baseAnim.stop();
    };

    return anim;
}

// Expose easing functions as well
animate.linear = mina.linear;
animate.easein = mina.easein;
animate.easeout = mina.easeout;
animate.easeinout = mina.easeinout;
animate.backin = mina.backin;
animate.backout = mina.backout;
animate.easeoutqart = function (t) {
    return 1 - ((--t) * t * t * t);
};
animate.step = function () {
    return 0;
};

module.exports = animate;
