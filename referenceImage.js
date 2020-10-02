const { Image } = require('image-js');
const cropY = require('./cropY');
const cropX = require('./cropX');
const cropToScoreboard = require('./lib/cropToScoreboard');
const saveMultiple = require('./lib/saveMultiple');
require('./lib/extendImagePrototype')();
const Path = require('path');


async function main(path,channel){
    Image.load(path)
    .then(image => {
        const fileName = Path.basename(path);
        console.log(`------------- ${fileName}-${channel} ----------------`);
        // images = cropToScoreboard(image);

        // clone the image
        let referenceImage = image.clone();
        referenceImage.save(`./${fileName}.png`);

        // grey the image
        referenceImage = referenceImage.channel(channel);
        referenceImage.save(`./${fileName}grey${channel.toUpperCase()}.png`);

        const { average, std } = referenceImage.sobelFilter().stats();
        console.log('Average:',average);
        console.log('STD:',std);

        const cannyImage = referenceImage.cannyEdge({
            lowThreshold:average + 2.5*std,
            highThreshold:average + 3*std,
            gaussianBlur:1.1,
            brightness:255,
            useHue:channel==='hue'? true:false,
        });
        cannyImage.save(`./${fileName}cannyEdge${channel.toUpperCase()}.png`);

        const images = cropX(cropY({ image, cannyImage }));
        images.forEach((image,index) => image.save(`./${fileName} - ${index}.png`))

        // // calculate it's morphological gradient
        // referenceImage = referenceImage.morphologicalGradient();
        // referenceImage.save('./morphReference.png');

        // let referenceImageClone = referenceImage.clone();

        // // threshold the morphological image... to remove small background details
        // referenceImage = referenceImage.threshold(20);
        // referenceImage.save('./morphRefThresh.png');

        // // filter original image by it's reference
        // image = filterByReference(image,referenceImage)
        // image.save('./filteredByRef.png');

        // // image = image.thresholdRGB(150)
        // // image.save('./filteredThresholdRGB.png')

        // image = image.thresholdHSL({
        //     type:'ifAll',
        //     S:{
        //      upper:1
        //     },
        //     L:{
        //         lower:80
        //     }
        // })
        // image.save('./filteredThresholdHSL.png')

        // image = image.grey();
        // image.save('./filteredGrey.png')

        // image = image.thresholdMask(160);
        // image.save('./filteredMask.png')

        // // console.log(referenceImageClone);
        // referenceImageClone = referenceImageClone.thresholdBinary(40);
        // referenceImageClone.save('./thresholdClone.png');

        
       
        // // imagePaths = saveMultiple(images)

    })
}

// filters an image by using another image as a reference
// each (x,y) point in the image will correspond to an (x,y) in the reference
// if the reference value is above 0, keep the original value
// otherwise, set the the original value to black
function filterByReference(image,referenceImage){
    const refData = referenceImage.data;
    let pixels = image.getPixelsArray();
    
    pixels = pixels.map((pixel,index) => {
        if(refData[index] > 0) return [...pixel,255];
        else return [0,0,0,255];
    });

    image.data = pixels.flat();
    return image
}




// main('./raw/nuketown.png','hue');
// main('./raw/nuketownBlast.png','hue');
// main('./raw/array.png','hue');
// main('./raw/crisis.png','hue');
// main('./raw/firingRange.png','hue');
// main('./raw/grid.png','hue');
main('./raw/jungle.png','hue');
// main('./raw/launch.png','hue');
// main('./raw/summit.png','hue');
// main('./raw/halo-3-1080p.png','hue');
// main('./raw/halo-3-1080p.jpg','hue');
// main('./raw/halo-3-dish.jpg','hue');
// main('./raw/halo3-big-team-battle.jpg','hue');
// main('./raw/halo-black-screen-720p.png','hue');
// main('./raw/halo-report-720p.png','hue');
// main('./raw/halo-score-313p.png','hue');
// main('./raw/halo-score-434p.PNG','hue');
// main('./raw/halo-scoreboard.png','hue');
// main('./raw/halo3-carnage-report.png','hue');
// main('./raw/halo3-training-grounds-1.png','saturation');
// main('./raw/halo3-training-grounds-2.png','saturation');
// main('./raw/halo3-training-grounds-3.png','saturation');
// main('./raw/halo3-training-grounds-4.png','saturation');
// main('./raw/halo3-training-grounds-5.png','saturation');
// main('./raw/halo3-training-grounds-6.png','saturation');
// main('./raw/halo3-training-grounds-7.png','saturation');
// main('./raw/halo3-training-grounds-8.png','saturation');
// main('./raw/halo3-training-grounds-9.png','saturation');
// main('./raw/halo2-ctf-carnage-report-1.png','saturation');
// main('./raw/halo2-ctf-1.png','saturation');
// main('./raw/halo2-ctf-noscore-1.png','saturation');
// main('./raw/halo2-ctf-blackscreen-1.png','saturation');