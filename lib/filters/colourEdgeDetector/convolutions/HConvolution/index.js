const jointRelevance = require('../../jointRelevance');
const signedHue = require('../../signedHue');

module.exports = function(convolution, options){
    const reducer = ((accumulator,[ weighting, [ H1, S1,], [ H2, S2,] ]) => accumulator + ( weighting * jointRelevance(S1,S2, options) * signedHue(H1,H2) ));
    return convolution.reduce(reducer, 0);
}