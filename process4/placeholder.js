// notes:
// image SB3 seemed to like [2/12,5, 0.660000000];
// image SB1 seemed to like [10/12, 0, 0.45];
// image SB2 seemed to like [9/12, 78, 0.12];

const { Image } = require('image-js'); //image processing library
const { createWorker, createScheduler } = require('tesseract.js'); //OCR image to text library
const { performance } = require("perf_hooks"); // performance hooks
const util = require('util');
const path = require('path');
const Fn = require('./lib/imageProcessing.js');
const tesseract = require('./lib/tesseractHelpers.js');

// global variable for timestamps
let t0 = 0; //start
let t1 = 0; //end

// text to match against for testing 
const test = ['[YAGB]LEGENDofTHUNDER',`[fml]NomadicFiend`,`[DBLD]Double D585`,`F1RSTDEGREE 99`,`DonkeyKick9000`,`[AR D]XGC KillnTym XD`,`Natti23`,`[859]KY Deadman84`,`KY Dyers eve`,`[ECHO]frogheroman`,`[519]Jacob966`,`JhonnyAce101`];
const bestValue = [0,0,0];


const analyse = async imageArray => {

    //Create a scheduler that contains one worker per image;
    const numberOfWorkers = imageArray.length;
    const scheduler = await tesseract.buildScheduler(numberOfWorkers); 
    
    //Add the data to be processed to all workers in the scheduler (1 image/job per worker);
    //TODO build a spinner so we know it's doin things, will require inquirer
    //TODO maybe a progress bar? for the whole operation, will require inquirer
    const results = await Promise.all(imageArray.map(imageRef => (
        scheduler.addJob('recognize',imageRef[0])
    )));
    
    // wait for the scheduler to finish.
    await scheduler.terminate(); 
    
    //Extract the rendered text data from the results, we should now have text for each image processed per index.
    textArray = results.map(result => {
       const { data: { text } } = result;
       return text;
    });
    
    console.log(textArray);
    
    //Creates timestamp, end of computation
    t1 = performance.now();
    // Calculates start and end time stamp difference and displays it in Seconds.
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);
    
//TODO map a comparison score for each text in the array

//TODO find the best score/s from the array and display them.

//TODO if these scores are better than any previous score. Update our best score to this number, with the variables that created it

}

//TODO will need to create a convolution average and standard deviation, create custom threshold that references our average image
async function Main(imageName, filters, progressHash) {

    //creates timestamp, start of computation
    t0 = performance.now();

    //creates a path to our image.
    const imagePath = path.join(__dirname,'raw',imageName);
    
    // Load in our image , returns a promise
    Image.load(imagePath)
    .then(image=>{ //do things with our image
        
        let suffix = 1;
        let imageArray = [];
        //define the directory to save the image
        const outputFile = path.join(__dirname,'processed');
       
        //if we don't have a progressHash, we need to create one
        if (progressHash === undefined){
            
            progressHash = Fn.createProgressHash(filters);
        }
       
        //TODO We need to filter the chunk first. create some kind of iteration count with it?
        //* need to work out, if this chunk will go over our paramters, and limit it if so.
        const chunk = 1; // is chunk something we set? or an internal parameter we don't touch?
        // loop over and create a 'chunk' of processed images stored in 'processed'
        for (let i = 0; i < chunk; i++) { 
            // update the progressHash
            progressHash = Fn.updateProgress(progressHash);

            //process the image
            const processedImage = Fn.process(image,progressHash);
            
            //save the image with a suffix 
            const imagePath = path.join(outputFile,`output${suffix}.png`);
            processedImage.save(imagePath);
            //Deep clone this instance of our progressHash
            const filterParameters = JSON.parse(JSON.stringify(progressHash));

            //Store this instance with the processed Image
            imageArray.push([imagePath,filterParameters]);

            console.log(`Image:${suffix} Successfully Processed`);
            suffix++;
            
        }
        
        // returns
        // The chunk of processed images for tesseract
        // The latest progressHash, next iteration of the recursive function will start from this hash.
        return { imageArray, progressHash };
})
.then(async fromProcessing => {
    
    const { imageArray, progressHash } = fromProcessing;

    //Passes the imageArray to tesseract to perform OCR.
    await analyse(imageArray);

    progressHash.forEach(element => {
        const value = element.option[Object.keys(element.limits)[0]];
        console.log(value);
    });

    imageArray.forEach(image => {
        const imageHash = image[1];
        const hashValues = imageHash.map(filterHash => {
            return filterHash.option.threshold;
        });
        hashValues.forEach(element => {
            console.log(element);
        });
    });
    // find the value and upperLimit of the last filter,

    //TODO instead of this cooky stuff, once we have written the chunk iteration count, just go off that
    value =  progressHash[0].option[Object.keys(progressHash[0].limits)[0]];
    upperLimit = progressHash[0].limits[Object.keys(progressHash[0].limits)[0]].upper;
    console.log(value);
    console.log(upperLimit);

    // if we haven't gone over our upperlimit, then keep running the function untill we do.
    if (value < upperLimit) {
        Main(imageName,filters, progressHash);
    }
    console.log(`The end?`);
});
}

// actually running the application 
// ==============================================================================================

// define our filters.
const filters = [
    {
        name:'thresholdRGB',
        threshold:{upper:102,lower:100,step:1}
    },
    {
        name:'thresholdBinary',
        algorithim:'threshold',
        threshold:{upper:0.66,lower:0.65,step:0.01},
        invert:true,
        useAlpha:true
    }
];

//* Starts off the iteration.
Main('SB3cropped.png',filters);