const hueRelevance = require('../hueRelevance');
module.exports = function( S1, S2, options ){
    return Math.sqrt( hueRelevance(S1, options) * hueRelevance(S2, options) ) 
}