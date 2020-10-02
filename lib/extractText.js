const tesseract = require('./tesseractHelpers.js');
const { performance } = require("perf_hooks"); // performance hooks
const referenceData = require('../data/referenceData');


module.exports = async function(imageArray,name) {

    //timestamp, start of processing
    const t0 = performance.now();

    //Create a scheduler that contains one worker per image;
    const numberOfWorkers = imageArray.length;
    const scheduler = await tesseract.buildScheduler(numberOfWorkers); 
    
    //Add the data to be processed to all workers in the scheduler (1 image/job per worker);
    //TODO build a spinner so we know it's doin things, will require inquirer
    //TODO maybe a progress bar? for the whole operation, will require inquirer
    const results = await Promise.all(imageArray.map(({imagePath}) => (
        scheduler.addJob('recognize',imagePath)
    )));
    
    // wait for the scheduler to finish.
    await scheduler.terminate(); 
    
    //Extract the rendered text data from the results, we should now have text for each image processed per index.
    const textArray = results.map(result => {
       const { data: { text } } = result;
       return text;
    });

    //Creates timestamp, end of processing
    const t1 = performance.now();
    // Calculates start and end time stamp difference and displays it in Seconds.
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);
    
    console.log(textArray);
    if(process.env.NODE_ENV === 'development') {
        const [ scorePercentage,itemsNotFound ] = tesseract.comparison(referenceData[name],textArray);
        console.log(`SCORE: ${scorePercentage}%`);
        if(itemsNotFound.length > 0) console.log(itemsNotFound);
    }
    return {textArray, imageArray}
}