const clamped360 = require('./clamped360');
const shiftMagnitude = require('./shiftMagnitude');

module.exports = shiftHue = ( hue, hueOption ) => {

    const { direction } = hueOption;

    const shiftMag = shiftMagnitude(hueOption);

    switch ( direction ) {

        case("clockwise"): hue -= shiftMag;
        break;

        case("anti-clockwise"): hue += shiftMag;
        break;

        default: throw new Error('Not a recognised direction')
    }

    return clamped360(hue);
}