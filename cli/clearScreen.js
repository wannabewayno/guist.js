const ks = require('node-key-sender');


module.exports = function(){
    // sends 'ctrl + s' to the os, returns a promise
    return ks.sendCombination(['control','l']);
}