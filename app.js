require('dotenv').config(); // load env variables
const { Image } = require('image-js'); //image processing library
require('./lib/extendImagePrototype')(); // loads custom filters into the Image prototype
const { performance } = require("perf_hooks"); // performance hooks
const path = require('path');
const saveMultiple = require('./lib/saveMultiple');
const gameConfig = require('./config/blackOps'); // game specific information
const extractText = require('./lib/extractText');
const processForOCR = require('./lib/processForOCR');
const cropToScoreboard = require('./lib/cropToScoreboard');

async function Main(imageName) {
    try {
        await require('./config/mongoConnect')
        console.log('Connected to Mongo Atlas');
    } catch (error) {
        console.log('ERROR: unable to connect tot Mongo Atlas',error);
    }

    //creates a path to our image in the 'raw' directory
    const imagePath = path.join(__dirname,'raw',imageName);
        
    // Load in our image, returns a promise
    Image.load(imagePath)
    .then(image => { //do things with our image

        // crop image to scoreboard in the x direction
        images = cropToScoreboard(image);

        // process the images for OCR
        processedImages = processForOCR(images);
        
        console.log(`Image Successfully Processed`);
        return processedImages;
    })
    .then(async images => {
        // saves images
        const imagePaths = await saveMultiple(images)
        console.log('Images successfully saved into Processed, handing over to Tesseract');
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
Main('grid.png');

