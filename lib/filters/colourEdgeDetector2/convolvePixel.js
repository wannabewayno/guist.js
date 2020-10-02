const HConvolution = require('./convolutions/HConvolution');
const SConvolution = require('./convolutions/SConvolution');
const LConvolution = require('./convolutions/LConvolution');

module.exports = function(regionOfInterest, options){

    const deltaH = HConvolution( regionOfInterest, options);
    const deltaS = SConvolution( regionOfInterest, options);
    const deltaL = LConvolution( regionOfInterest, options);

    return Math.abs(deltaH + deltaS + deltaL);

}