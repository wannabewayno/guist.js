const { Image } = require('image-js'); //image processing library
const { performance } = require("perf_hooks"); // performance hooks
const path = require('path');
const tesseract = require('./lib/tesseractHelpers.js');

// loads extended image prototype
require('./lib/filters')();

const saveMultiple = require('./lib/saveMultiple');

// imports information speceific to the game being processed
const gameConfig = require('./config/blackOps');

// global variable for timestamps
let t0 = 0; //start
let t1 = 0; //end

// text to match against for testing 
const array = ['[3arc]TJKeegan','[3arc]ABhura','[3arc]TEWells','PinkSine9','[3arc]JBojorquez','[3arc]AKrauss','[3arc]DAA Anthony','[3arc]GJNg','[3arc]MDonlon','[3arc]EFRich','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz','2080 18 19 0.95 4','1900 18 17 1.06 2','1780 16 16 1.00 4','900 9 23 0.39 0','2200 22 7 3.14 0','1640 16 6 2.67 1','1420 13 12 1.08 2','1300 13 11 1.18 0','640 6 11 0.55 1','640 5 15 0.33 3'];
const nukeTown = ['[3arc]PTasker','PinkSine9','[3arc]AEady','[3arc]IJKowalski','[3arc]JMattis','[3arc]LAJohansen','[3arc]CCowell','[3arc]SNouriani','[3arc]SRoud','[3arc]PBabar','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz','2570','23','17','1.35','5','2420','23','18','1.28','2','1900','17','19','0.89','4','1320','12','20','0.60','2','1960','19','12','1.58','1','1860','16','11','1.45','5','1440','12','10','1.20','4','1390','11','14','0.79','5','980','7','13','0.54','4','970','8','16','0.5',3]
const test = ['[YAGB]LEGENDofTHUNDER',`[fml]NomadicFiend`,`[DBLD]Double D585`,`F1RSTDEGREE 99`,`DonkeyKick9000`,`[AR D]XGC KillnTym XD`,`Natti23`,`[859]KY Deadman84`,`KY Dyers eve`,`[ECHO]frogheroman`,`[519]Jacob966`,`JhonnyAce101`];


const analyse = async imageArray => {

    //Create a scheduler that contains one worker per image;
    const numberOfWorkers = imageArray.length;
    const scheduler = await tesseract.buildScheduler(numberOfWorkers); 
    
    //Add the data to be processed to all workers in the scheduler (1 image/job per worker);
    //TODO build a spinner so we know it's doin things, will require inquirer
    //TODO maybe a progress bar? for the whole operation, will require inquirer
    const results = await Promise.all(imageArray.map(imagePath => (
        scheduler.addJob('recognize',imagePath)
    )));
    
    // wait for the scheduler to finish.
    await scheduler.terminate(); 
    
    //Extract the rendered text data from the results, we should now have text for each image processed per index.
    const textArray = results.map(result => {
       const { data: { text } } = result;
       return text;
    });

    //Creates timestamp, end of computation
    t1 = performance.now();
    // Calculates start and end time stamp difference and displays it in Seconds.
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);
    
    console.log(textArray);

    const [ scorePercentage,itemsNotFound ] = tesseract.comparison(nukeTown,textArray);

    console.log(`SCORE: ${scorePercentage}%`);
    if(itemsNotFound.length > 0) console.log(itemsNotFound);
}

//TODO will need to create a convolution average and standard deviation, create custom threshold that references our average image
async function Main(imageName) {

    //creates timestamp, start of computation
    t0 = performance.now();

    //creates a path to our image.
    const imagePath = path.join(__dirname,'raw',imageName);
    
    // Load in our image , returns a promise
    Image.load(imagePath)
    .then(image => { //do things with our image

        //crops the x direction from the config file
        const { scoreboardBoundary } = gameConfig; 
        image = image.crop(scoreboardBoundary)

        // automatically finds rows within the image.
        const dataLocations = image.findRows();
  
        // crops images into discrete boxes where data is contained
        let images = image.cropMultiple(dataLocations);

        // filters go here
        // ================================================
        
        const hueCounts = images.map((image,index) => {
            if (image.width < 800 || index === 0){
                return 0
            } else {
                const hueCount = image.hueCount([36,54])
                console.log('hueCount:',hueCount,'Index:',index);
                return hueCount;
            }
        })

        const specialIndex = hueCounts.indexOf(Math.max(...hueCounts));

        images = images.map((image,index) => {

            if(index === specialIndex){
                image.save('./beforeHue.png')
                image = image.adjustHue([36,54]);
                image.save('./afterHue.png')
            }
            
            const { average, std } = image.stats();
            const threshold = average + std * 3
            image = image.thresholdRGB(threshold);
            image = image.grey();
            image = image.thresholdMask(162);

            return image;
        })
        // images = images.map(image => image.thresholdRGB(160))
        // images = images.map(image => image.thresholdHSL({
        //     type:'ifAll',
        //     S:{ upper:6 },
        //     L:{ lower:80 },
        // }))
        
        // images = images.map(image => image.grey())
        // images = images.map(image => image.topHat({
        //     kernel:[
        //         [1,1],
        //         [1,1]
        //     ]
        // }))
        // images = images.map(image => image.threshold(180))
        // images = images.map(image => image.invert())
        // images = images.map(image => image.open())
        // images = images.map(image => image.sobelFilter())
        // images = images.map(image => image.topHat({
        //     kernel:[
        //         [1,1],
        //         [1,1]
        //     ]
        // }))
        // images = images.map(image => image.open())
        // images = images.map(image => image.thresholdMask(150))
        // images = images.map(image => image.mask({algorithm:'threshold',threshold:0.61,useAlpha:true,invert:true}));
        
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
    .then(async imagePaths => {

        //Passes the imagePaths to tesseract to perform OCR.
        await analyse(imagePaths);
    
    });
}

// actually running the application 
// ==============================================================================================


//* Starts off the iteration.
Main('cod2.png');

