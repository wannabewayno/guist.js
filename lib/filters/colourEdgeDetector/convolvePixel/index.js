const HConvolution = require('../convolutions/HConvolution');
const SConvolution = require('../convolutions/SConvolution');
const LConvolution = require('../convolutions/LConvolution');
const SobelConvolution = require('../convolutions/SobelConvolution');

module.exports = function(regionOfInterest, { direction, mode, ...options }){
    const convolution = SobelConvolution(regionOfInterest, direction)
    const deltaH = HConvolution( convolution, options);
    const deltaS = SConvolution( convolution, mode, options);
    const deltaL = LConvolution( convolution, mode, options);

    return Math.abs(deltaH + deltaS + deltaL);

}