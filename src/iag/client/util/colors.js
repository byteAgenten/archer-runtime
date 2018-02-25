module.exports = {

    color: function (colorString) {
        return Snap.getRGB(colorString);
    },

    rgb2hex: function (color) {
        // Edge-case: If a color is "undefined" (e.g. "none") then Snap.getRGB parses rgb values to -1
        // However Snap.rgb doesn't handle that case when converting back to hex so we do it here
        if (color.r < 0 || color.g < 0 || color.b < 0) {
            return 'none';
        }

        var opacity = color.opacity;
        opacity = opacity != null && opacity < 1
            ? opacity
            : undefined;

        // Only provide opacity if it exists and has a value less than one,
        // without providing an opacity we force Snap to return a hex value
        return Snap.rgb(color.r, color.g, color.b, opacity);
    },

    interpolateRgb: function (color1, color2, factor) {

        if (factor == 0) return color1;
        if (factor == 1) return color2;

        // Edge-case: If a color is "undefined" (e.g. "none") then Snap.getRGB parses rgb values to -1
        // We can't interpolate from "none",
        // so we replace "none" with the color value from the second color and use an opacity of 0
        if (color1.r < 0 || color1.g < 0 || color1.b < 0) {
            color1 = { r: color2.r, g: color2.g, b: color2.b, opacity: 0 };
        }

        if (color2.r < 0 || color2.g < 0 || color2.b < 0) {
            color2 = { r: color1.r, g: color1.g, b: color1.b, opacity: 0 };
        }

        if (arguments.length < 3) {
            factor = 0.5;
        }

        var opacity1 = color1.opacity != null ? color1.opacity : 1;
        var opacity2 = color2.opacity != null ? color2.opacity : 1;

        return {
            r: Math.round(color1.r + (factor * (color2.r - color1.r))),
            g: Math.round(color1.g + (factor * (color2.g - color1.g))),
            b: Math.round(color1.b + (factor * (color2.b - color1.b))),
            opacity: opacity1 + (factor * (opacity2 - opacity1))
        };
    }
};
