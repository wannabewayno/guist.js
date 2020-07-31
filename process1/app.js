const { Image } = require('image-js'); //image processing library
const { createWorker, createScheduler } = require('tesseract.js'); //OCR image to text library
const { performance } = require("perf_hooks"); // performance hooks
const path = require('path');
const fs = require('fs');
const CODconfiguration = require('./COD.config');
const { scoreboardBoundary } = CODconfiguration
// const { average } = require('./lib/post-processing.js');
// 90% [110, 0.51]
// 90% [114, 0.48]
// 90% [116, 0.51]
// 90% [118, 0.54]
// 90% [120, 0.54]
// 90% [122, 0.53]
// 90% [130, 0.53]
// 90% consistent 90%'s accross the board with [146,0.51]
// 100% BOOOOOO YEAAAAH [146, 0.61], [146, 0.62]

let t0 = 0;
let t1 = 0;
gamerTag = ['[3arc]TJKeegan','[3arc]ABhura','[3arc]TEWells','PinkSine9','[3arc]JBojorquez','[3arc]AKrauss','[3arc]DAA Anthony','[3arc]GJNg','[3arc]MDonlon','[3arc]EFRich','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz'];
gamerTag2 = ['killahhh.-Â\00BB',`seb008-seacow`,`[[Reaper]]`,`Poo|ToeKnee`,`Invictus`,`davemck89`,`|.:|Zio Matrix`,`darkraider`,`Icefyre`,`>TG< BloodSplat`,`xTwilightDawnx`,`da_moletrix`];
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

let threshCount = 164;
let globalthresh = 0.77;

const analyse = async () =>{
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]. ',
    });
    const { data: { text } } = await worker.recognize(path.join(__dirname,`output.png`));

    const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data/data.json'),'utf-8'));
    console.log(data);
    
    await worker.terminate();
    t1 = performance.now();
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);

    const score = [];
    score.push(comparison(gamerTag,text));
    score.push(threshCount);
    score.push(globalthresh);
    
    if (score[0]>bestValue[0]){
       for (let i = 0; i < score.length; i++) {
           bestValue[i] = score[i]
       }
    }
    console.log(text);
    console.log(bestValue);
    console.log([`MATCH:${score[0]}`]);
    console.log('THRESHOLD:',score[1],score[2]);

    if(score[0] >= 80){
        data.over80++
        data.data.push(score);
    } else {
        data.under80++
    }

    fs.writeFileSync(path.join(__dirname,'/data/data.json'),JSON.stringify(data));

    if (threshCount < 255 ) {
        if (globalthresh >= 0.8){
            globalthresh = 0.55;
            threshCount +=1;
        }
        globalthresh+=0.01;
        Main(threshCount,globalthresh);
    }
   
}


async function Main(threshCount,globalthresh) {
t0 = performance.now();
// Load in an image
Image.load('./cropped4.png')
//returns a promise
.then(image=>{
    let index = 0;

    console.log('Average Pixels before:',average(image));

    image = image.crop(scoreboardBoundary)

    index++;
    image = thresholdA(image,threshCount); // threshold pixels under the threshold limit to black
    // image.save(`./output/${index}threshold.png`);

    console.log('Average Pixels After:',average(image));

    // index++;
    // image = image.blurFilter(); //blur filter
    // image.save(`./output/${index}blur.png`)
    
    // index++;
    // image = image.gaussianFilter(); //guassian blur filter
    // image.save(`./output/${index}guassian.png`)

    index++;
    image = image.grey({keepAlpha:true}); // grey image
    // image.save(`./output/${index}grey.png`);

    // console.log(average(image));

    // image = image.topHat(); // apply top hat filter
    // image.save(`./output/${index}topHat.png`);
    // index++;
    
    index++;
    image = image.mask({algorithm:'threshold',threshold:globalthresh,useAlpha:true,invert:true}); //binary mask
    // image.save(`./output/${index}mask.png`) 

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
    
    image.save(path.join(__dirname,`output.png`)); //
    console.log(`Image successfully processed`);
})
.finally(result=> analyse())
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