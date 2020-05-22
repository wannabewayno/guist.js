const { createWorker, createScheduler } = require('tesseract.js');
const { Image } = require('image-js');
const methods = require("./methods.js");
const { performance } = require("perf_hooks");

const playerScore = ["3260 32 3 4", "960 9 3 12","640 6 2 3","420 4 1 6","400 4 0 0","400 4 0 6","800 8 0 5","700 7 0 11","400 4 0 17","200 2 0 8","0 0 0 1","0 0 0 4"] 
const gamerTags = ['Dani3l<3','BlackWolf','HOCANINOGLU','maskinen',"i'fucku",'ZeusVanZall~///','JA','erik1953','dor dani','Get On My LvL','Jake132Hun','Esji']
const allScores = [];

function comparison(Real,Generated){
    const resultString = Generated.join('');
    count = 0;
    Real.forEach(real => {
        if(resultString.indexOf(real)!==-1){
            count++;
        }
    });
    comparisonScore = count/Real.length*100;
    return comparisonScore;
}

// Loading an image is asynchronous and will return a Promise.
async function compare(threshold){

    Image.load('./images/SB1.png').then(async image => {
        const grey = image.grey();
        const cropBoxes = methods.createCropBoxes(12,methods.gamerTag,true);
        const imageArray = await methods.crop(cropBoxes,image,threshold);
        console.log("--------- block 0 -----------");
    }).then(result => {

    function getImages(number){
        imgArray = [];
        for (let i = 1; i <= number; i++) {
            imgArray.push(`cropped${i}.png`);
        }
        return imgArray
    }
    const imageArray = getImages(12);
    console.log(imageArray);

    console.log("---------- block 1 ----------------");
    const scheduler = createScheduler();
    const worker1 = createWorker();
    const worker2 = createWorker();

    (async () => {
        console.log("----------- block 2 --------------");
    await worker1.load();
    await worker2.load();
    await worker1.loadLanguage('eng');
    await worker2.loadLanguage('eng');
    await worker1.initialize('eng');
    await worker2.initialize('eng');
    scheduler.addWorker(worker1);
    scheduler.addWorker(worker2);
    console.log("-------- block 3 ------------");
    /* Add your images to the recognition jobs */
    const result = await Promise.all(imageArray.map((value) => (
        scheduler.addJob('recognize',value)
    )))
    resultArray=[];
    result.forEach(data => {
        resultArray.push(data.data.text);
    });
        const score = [];
        score.push(comparison(gamerTags,resultArray));
        score.push(threshold);
        allScores.push(score);
        console.log(allScores);
      console.log(resultArray);
    await scheduler.terminate(); // It also terminates all workers.
    })();})
}

// for (let i = 0; i < 255 ; i+=5) {
//     return new Promise((resovle,reject)=>{
//         resovle(compare(i));
//         reject(new Error("OH NO"));
//     });
// }


 let numberCounter = 99
function compareALL(){
    if(numberCounter===200){
        return
    }
    numberCounter+=1;
    compare(numberCounter);
    setTimeout(() => {
        compareALL();
    }, 5000);
}
    // compareALL();
    async function process(threshold) {
    t0 = performance.now();
    await compare(threshold);
    t1 = performance.now();
    console.log(t1-t0);
    }
    process(16);
