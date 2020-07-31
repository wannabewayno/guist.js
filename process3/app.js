const { Image } = require('image-js'); //image processing library
const { createWorker, createScheduler } = require('tesseract.js'); //OCR image to text library
const { performance } = require("perf_hooks"); // performance hooks
const path = require('path');
const CODconfiguration = require('./COD.config');
const fs= require('fs');
const { scoreboardBoundary } = CODconfiguration
require('./lib/extendImage')();

let t0 = 0;
let t1 = 0;


const gamerTag2 = ['[3arc]PTasker','PinkSine9','[3arc]AEady','[3arc]JKowalski','[3arc]JMattis','[3arc]LAJohansen','[3arc]CCowell','[3arc]SNouriani','[3arc]SRoud','[3arc]PBabar','Kills','Deaths','Assists','Ratio','Spetsnaz','Black Ops']
const gamerTag3 = ['[YAGB]LEGENDofTHUNDER',`[fml]NomadicFiend`,`[DBLD]Double D585`,`F1RSTDEGREE 99`,`DonkeyKick9000`,`[AR D]XGC KillnTym XD`,`Natti23`,`[859]KY Deadman84`,`KY Dyers eve`,`[ECHO]frogheroman`,`[519]Jacob966`,`JhonnyAce101`];
bestValue = [0,0,0];
const average = image => {
    const sum = image.data.reduce((a,b) => a + b, 0);
    const average = sum/image.data.length;
    return average;
}

const thresholdA = (image,threshold) => {
    const channels = image.channels;
    image.data = image.data.map((pixel,index) => {
      if(pixel < threshold && ((index+1)/channels)%1!==0){
          return 0;
      } else {
          return pixel;
      }
    });
    return image;
}

function comparison(Real,Generated){
    const resultString = Generated;
    count = 0;
    Real.forEach(real => {
        if(resultString.indexOf(real)!==-1){
            count++;
        }
    });
    comparisonScore = count/Real.length*100;
    return comparisonScore;
}

let threshCount = 192;
let globalthresh = 0;

const analyse = async () =>{
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]. ',
    });
    const { data: { text } } = await worker.recognize(path.join(__dirname,`output.png`));

    await worker.terminate();
    t1 = performance.now();
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);
    // get data
    const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data/data.json'),'utf-8'));
    console.log(data);
    console.log(text);

    const score = [];
    score.push(comparison(gamerTag2,text));
    score.push(threshCount);
    score.push(globalthresh);
    if (score[0]>bestValue[0]){
       for (let i = 0; i < score.length; i++) {
           bestValue[i] = score[i]
       }
    }
    console.log('BEST VALUE:',bestValue);
    console.log('CURRENT MATCH:',score[0]);
    console.log('THRESHOLD:',threshCount,globalthresh);

    if(score[0] >= 80){
        data.over80++
        data.data.push(score);
    } else {
        data.under80++
    }

    fs.writeFileSync(path.join(__dirname,'/data/data.json'),JSON.stringify(data));

    if (threshCount < 255 ) {
        if (globalthresh >= 0.2){
            globalthresh = 0;
            threshCount += 1;
        }
        globalthresh+=0.005;
        Main(threshCount,globalthresh);
    }
   
}


async function Main(threshCount,globalthresh) {
t0 = performance.now();
// Load in an image
Image.load('./cropped4.png')
//returns a promise
.then(image => {
    let index = 0

    image = image.crop(scoreboardBoundary)

    // console.log('Prototype of image:',Image.prototype);
   

    index++;
    // image = thresholdA(image,threshCount); // threshold pixels under the threshold limit to black
    // image.save(`./output/${index}threshold.png`);

    // console.log(average(image));

    // index++;
    // image = image.blurFilter(); //blur filter
    // image.save(`./output/${index}blur.png`)
    
    // image = thresholdA(image,threshCount);

    // index++;
    // image = image.gaussianFilter(); //guassian blur filter
    // image.save(`./output/${index}guassian.png`)

    index++;
    let boxImage = image.clone();
    boxImage = boxImage.grey({keepAlpha:true}); // grey image
    // image.save(`./output/${index}grey.png`);


   boxImage =boxImage.sobelFilter({
        direction:'y'
    })

    // image = image.topHat({
    //     iterations:1,
    //     kernel:[
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //     ]
    // });
    // image.save(`./output/${index}topHat.png`);
    // index++;
    
    // image = thresholdA(image,50);

    // console.log(image.getMatrix());

    // image = image.blackHat();

    index++;
    // image = image.mask({algorithm:'threshold',threshold:0.1,useAlpha:true,invert:true}); //binary mask
    // image.save(`./output/${index}mask.png`) 

    boxImage = boxImage.thresholdBinary(60)

    const scoreBoxes = boxImage.findRows();
    scoreBoxes.forEach((scoreBox,index) =>{
        let clone = image.clone()
        clone = clone.crop(scoreBox)
        clone.save(`clone${index}.png`)
    })
    boxImage.save(path.join(__dirname,`template.png`))


    // console.log(average(image));

    // image = image.rgba8();
    // image.save(`./output/${index}rgba8.png`) // rgb image from a binary mask
    // index++;
   
    // image = image.grey({keepAlpha:true}); // grey image
    // image.save(`./output/${index}grey.png`);
    // index++;

    // index++;
    // image = image.gaussianFilter(); //guassian blur filter
    // image.save(`./output/${index}guassian.png`)

    // image = image.sobelFilter(); //sobel filter
    // image.save(`./output/${index}sobel.png`)
    // index++;

    // image = image.cannyEdge(); //sobel filter
    // image.save(`./output/${index}sobel.png`)
    // index++;

    // image = threshold(image,90); // threshold pixels under 80 to black
    // image.save(`./output/${index}threshold.png`);
    // index++;
    // console.log(image.data);

    // image = image.mask({algorithm:'threshold',threshold:0.1,useAlpha:false,invert:true}); //binary mask
    // image.save(`./output/${index}mask.png`) // thresholded image
    // index++;
    
    // image = image.blurFilter(); //blur filter
    // image.save(`./output/${index}blur.png`)
    // index++;

    // image = image.grey({keepAlpha:false}); // grey image
    // image.save(`./output/${index}grey.png`);
    // index++;

    // image = image.dilate(); // dilate image
    // image.save(`./output/${index}dilate.png`);
    // index++;

    // image = image.erode(); // erode image
    // image.save(`./output/${index}erode.png`);
    // index++;
    // console.log(path.join(__dirname,`output.png`));
    image.save(path.join(__dirname,`output.png`)); //
    console.log(`Image successfully processed`);
})
// .finally(result=> analyse())
}

Main(threshCount,globalthresh);
// analyse();


  // image = threshold(image,80); // threshold pixels under 80 to black
    // image.save(`./output/${index}threshold.png`);
    // index++;

    // image = image.topHat(); // apply top hat filter
    // image.save(`./output/${index}topHat.png`);
    // index++;

    // let count = 1
    // const interval = image.width*image.channels;
    // for (let i = 0; i < (image.width*image.height*image.channels)-interval; i+=interval) {
    //     count++;
    //     console.log(image.data.slice(i,i+interval));
    // }