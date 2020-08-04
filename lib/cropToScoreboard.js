require('./extendImagePrototype')();
const gameConfig = require('../config/blackOps');

module.exports = function(image) {
    //TODO: crop the x direction dynamically like we do for the y, no need for a config file then.
  
    const { scoreboardBoundary } = gameConfig;
    //crops the x direction from the config file
    image = image.crop(scoreboardBoundary);

    // automatically finds rows within the image.
    const dataLocations = image.findRows();

    // crops images into discrete boxes where data is contained
    let images = image.cropMultiple(dataLocations);

    return images;
}