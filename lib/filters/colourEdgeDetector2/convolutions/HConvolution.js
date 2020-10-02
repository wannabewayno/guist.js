const SobelConvolution = require('./SobelConvolution');
const jointRelevance = require('../jointRelevance');
const signedHue = require('../signedHue');

module.exports = function(pixels, { direction }){
    const convolution = SobelConvolution(pixels, direction);
    const reducer = (([weighting, [H1,S1,], [H2,S2,]]) => weighting * jointRelevance(S1,S2) * signedHue(H1,H2))
    return convolution.reduce(reducer, 0);
}