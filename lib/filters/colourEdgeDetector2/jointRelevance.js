const hueRelevance = require('hueRelevance');
module.exports = function(S1,S2){
    return Math.sqrt( hueRelevance(S1) * hueRelevance(S2) ) 
}