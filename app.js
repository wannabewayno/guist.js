require('dotenv').config(); // load env variables
const { Image } = require('image-js'); //image processing library
require('./lib/filters')(); // loads custom filters into the Image prototype
const { performance } = require("perf_hooks"); // performance hooks
const path = require('path');
const saveMultiple = require('./lib/saveMultiple');
const gameConfig = require('./config/blackOps'); // game specific information
const extractText = require('./lib/extractText');

// global variable for timestamps
let t0 = 0; //start
let t1 = 0; //end

// text to match against for testing 
const array = ['[3arc]TJKeegan','[3arc]ABhura','[3arc]TEWells','PinkSine9','[3arc]JBojorquez','[3arc]AKrauss','[3arc]DAA Anthony','[3arc]GJNg','[3arc]MDonlon','[3arc]EFRich','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz','2080 18 19 0.95 4','1900 18 17 1.06 2','1780 16 16 1.00 4','900 9 23 0.39 0','2200 22 7 3.14 0','1640 16 6 2.67 1','1420 13 12 1.08 2','1300 13 11 1.18 0','640 6 11 0.55 1','640 5 15 0.33 3'];
const nukeTown = ['[3arc]PTasker','PinkSine9','[3arc]AEady','[3arc]IJKowalski','[3arc]JMattis','[3arc]LAJohansen','[3arc]CCowell','[3arc]SNouriani','[3arc]SRoud','[3arc]PBabar','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz','2570 23 17 1.35 5','2420 23 18 1.28 2','1900 17 19 0.89 4','1320 12 20 0.60 2','1960 19 12 1.58 1','1860 16 11 1.45 5','1440 12 10 1.20 4','1390 11 14 0.79 5','980 7 13 0.54 4','970 8 16 0.5 3']

async function Main(imageName) {
    require('./config/mongoConnect')
    .then(() => { // great! connected to mongo, keep going 

        //creates timestamp, start of computation
        t0 = performance.now();

        //creates a path to our image.
        const imagePath = path.join(__dirname,'raw',imageName);
        
        // Load in our image, returns a promise
        return Image.load(imagePath)
    })
    .catch(error => console.log(error))
    .then(image => { //do things with our image

        //crops the x direction from the config file
        const { scoreboardBoundary } = gameConfig;
        //TODO: crop the x direction dynamically like we do for the y, no need for a config file then.

        image = image.crop(scoreboardBoundary)

        // automatically finds rows within the image.
        const dataLocations = image.findRows();
  
        // crops images into discrete boxes where data is contained
        let images = image.cropMultiple(dataLocations);

        // filters go here
        // ================================================
        
        // finds the one odd yellow gamertag and brightens it for processing
        const hueCounts = images.map((image,index) => {
            if (image.width < 800 ){
                return 0
            } else {
                const hueCount = image.hueCount([36,54])
                console.log('hueCount:',hueCount,'Index:',index);
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
            console.log(teams);

            const teamCount = teams.map(({name,hueRange}) => {
                const count = image.hueCount(hueRange)
                return {
                    count,
                    name
                }
            })
            console.log(teamCount);
            // the team with the biggest count is the team this player is on
            const { name } = teamCount.find(({count}) => count === Math.max(...teamCount.map(({count})=>count)))
            console.log('TEAM:',name);
            
            const { average, std } = image.stats();
            const threshold = average + std * 2.25
            image = image.thresholdRGB(threshold);
            image = image.grey();
            image = image.thresholdMask(175);

            return { image, team:name }
        })
        
        // ================================================

        // end of the line, saves images as is and passes this to tesseract
        console.log(`Image Successfully Processed`);
        return images
       
    })
    .then(async images => {
        const imagePaths = await saveMultiple(images)
        console.log('Images successfully saved, sending to Tesseract');
        return imagePaths
    })
    .then(imagePaths => {
        //Passes the imagePaths to tesseract to perform OCR.
        extractText(imagePaths);
    });
}

// actually running the application 
// ==============================================================================================

//* Starts off the iteration.
Main('liveTest2.png');

