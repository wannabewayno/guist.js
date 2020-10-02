module.exports = function(pixels, { mode, direction }){
    const convolution = SobelConvolution(pixels, direction);

    switch(mode) {
        case'hueComplement':{
            const reducer = (sum, ([weighting, [,S1,], [,S2,]]) => sum + ( weighting * (S1 - S2) ))
            return Math.abs(convolution.reduce(reducer, 0));
        }
        case'hueDominant':{
            const reducer = (sum, ([weighting, [,S1,], [,S2,]]) => sum + ( weighting * (1 - jointRelevance(S1,S2)) * (S1 - S2) ));
            return Math.abs(convolution.reduce(reducer, 0));
        }
        default: throw new Error(`Error: mode: ${mode} - passed to LConvolution is not recognised. Allowed values are 'hueComplement'|'hueDominant'`)
    } 
}