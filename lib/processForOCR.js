const { Image } = require('image-js'); //image processing library
require('./extendImagePrototype')(); // loads custom filters into the Image prototype
const { performance } = require("perf_hooks"); // performance hooks
const gameConfig = require('../config/blackOps'); // game specific information

module.exports = function(images) {

    // if only a single image get's loaded, convert to an array of length 1 for combatibility.
    if(!Array.isArray(images)) images = [images];

    // filters go here
    // ================================================
    
    // finds the one odd yellow gamertag and brightens it for processing
    const hueCounts = images.map((image,index) => {
        if (image.width < 800 ){
            return 0
        } else {
            const hueCount = image.hueCount([36,54])
            if(process.env.NODE_ENV==='development') console.log('hueCount:',hueCount,'Index:',index);
            return hueCount;
        }
    })
    const specialIndex = hueCounts.indexOf(Math.max(...hueCounts));

    // filtering each image
    images = images.map((image,index) => {

        // after marking special yellow gamertag, we brighten it here
        if(index === specialIndex){
            image = image.adjustHue([36,54]);
        }

        //before we filter, we use the colours to assign teams.
        const { teams } = gameConfig;
        // console.log(teams);

        const teamCount = teams.map(({name,hueRange}) => {
            const count = image.hueCount(hueRange)
            return {
                count,
                name
            }
        })
        // console.log(teamCount);
        // the team with the biggest count is the team this player is on
        const { name } = teamCount.find(({count}) => count === Math.max(...teamCount.map(({count})=>count)))
        // console.log('TEAM:',name);
        
        const { average, std } = image.stats();
        const threshold = average + std * 2.5
        image = image.thresholdRGB(threshold);
        image = image.grey();
        image = image.thresholdMask(165);

        return { image, team:name }
    })
    
    // ================================================
    return images
}