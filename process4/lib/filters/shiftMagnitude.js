const clamped360 = require('./clamped360');
/**
 * @param  {Object} hueOption - an object containing information about the hue conditions
 * @param  {Number} hueOption.upper - the upper limit for the filter
 * @param  {Number} hueOption.lower - the lower limit for the filter 
 * @return {Number} - the magnitude to shift the hue by. This is the minimum shift required to clear the filtered zone
 */
module.exports = shiftMagnitude = hueOption => {
    const { upper , lower } = hueOption;

    const shiftMagnitude = clamped360(Math.abs(lower-upper) + 360);

    return shiftMagnitude
}
