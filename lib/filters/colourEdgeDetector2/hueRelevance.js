const erf = require('math-erf');

const curveSmoothing = ( saturation,{ smoothing=0.2, midpoint=0.5 }) => {
    return (1/smoothing) * ( saturation/255 - midpoint );
}

/**
 * Calculates an arbitary measure from 0 to 1 of how relevant Hue is for Edge detection
 * ? Example: saturation of 0 is a completely grey image, Hue can't be determined even though it might be defined
 * ? Example: saturation of 51 yields 0.0016,
 * ? Example: saturation of 155 yields 0.76, 
 * @param {Number} saturation = Saturation of colour
 * @param {Object} options 
 * @param {Number} [options.smoothing=0.2] 
 * @param {Number} [options.midpoint=0.5] 
 */
module.exports = function(saturation,options) {
    return (1/2) * ( erf(curveSmoothing(saturation,options) ) + 1)  
}