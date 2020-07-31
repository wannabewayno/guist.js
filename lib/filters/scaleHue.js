const clamped360 = require('./clamped360');
const shiftMagnitude = require('./shiftMagnitude');

/** scaleHue()
 * @param  {Number} hue - The hue [0,360]
 * @param  {Object} hueOption - conditions imposed on filtering the hue value
 * @param  {Number} hueOption.upper - upper limit from filter
 * @param  {Number} hueOption.lower - lower limit from filter
 * @param  {String} hueOption.direction - direction you want to shift, blueshift "anti-clockwise" or redshift "clockwise"
 * @return {Number} - the scaled hue
 */
module.exports = scaleHue = ( hue, hueOption ) => {
    const { upper, lower, direction } = hueOption;
    const shiftMag = shiftMagnitude(hueOption);
    const scaleFactor = ( 360 / shiftMag ) - 1;

    let scaledHue;

    switch ( direction ) {

        case ("clockwise"): {
            const difference = clamped360( hue - upper ) / scaleFactor;
            scaledHue = clamped360( upper + difference );
        }
        break;

        case ("anti-clockwise"): {
            const difference = clamped360( lower - hue ) / scaleFactor;
            scaledHue = clamped360( lower - difference );
        }
        break;

        default: throw new Error('Not a recognised direction');
    }

    return scaledHue
}