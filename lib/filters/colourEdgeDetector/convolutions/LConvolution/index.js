const jointRelevance = require('../../jointRelevance');

module.exports = function(convolution, mode, options){

    switch(mode) {
        case'hueComplement':{
            const reducer = ((accumulator, [ weighting, [,, L1 ], [,, L2 ] ]) => accumulator + ( weighting * (L1 - L2) ))
            return Math.abs(convolution.reduce(reducer, 0));
        }
        case'hueDominant':{
            const reducer = ((accumulator, [ weighting, [, S1, L1 ], [, S2, L2 ] ]) => accumulator + ( weighting * (1 - jointRelevance(S1, S2, options)) * (L1 - L2) ));
            return Math.abs(convolution.reduce(reducer, 0));
        }
        default: throw new Error(`Error: mode: ${mode} - passed to LConvolution is not recognised. Allowed values are 'hueComplement'|'hueDominant'`)
    } 
}