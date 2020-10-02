const { Image } = require('image-js'); //image processing library
require('./extendImagePrototype')(); // loads custom filters into the Image prototype
const path = require('path');
const saveMultiple = require('./saveMultiple');
const extractText = require('./extractText');
const processForOCR = require('./processForOCR');
const cropToScoreboard = require('./cropToScoreboard');
const extractScores = require('./extractScores');

module.exports = async function(partialImagePath) {

    const imagePath = path.relative(
        __dirname,
        path.join('./guist',partialImagePath)
    );

    const { name } = path.parse(imagePath);
    console.log('IMG NAME:',name);

    // Load in our image, returns a promise
    return Image.load(imagePath)
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
        const imagePaths = await saveMultiple(images,name)
        console.log('Images successfully saved into Processed, handing over to Tesseract');
        return imagePaths
    })
    .then(async imagePaths => {
        //Passes the imagePaths to tesseract to perform OCR.
        const rawData = await extractText(imagePaths,name);
        const scores = extractScores(rawData);
        return scores
    });

}

