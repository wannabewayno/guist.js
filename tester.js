const processImage = require('./lib/processImage');
const { Image } = require('image-js');

async function main(imagePath) {
    const scores = await processImage(imagePath);
    console.log(scores);

    // Image.load('./raw/grid.png')
    // .then(boxImage => {

    // // detects rows
    // // boxImage = boxImage.sobelFilter();
    // // boxImage.save('./sobel.png');

    // // convert to grey image
    // boxImage = boxImage.grey({keepAlpha:true});
    // boxImage.save('./morphgrey.png');

    // // apply the morphologicalGradient
    // boxImage = boxImage.morphologicalGradient({
    //     kernel: [
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //         [1,1,1,1,1],
    //         [1,1,1,1,1]
    //     ]
    // });
    // boxImage.save('./morphologicalGradient.png');

    // // if under threshold set to black(0) otherwise set to white (255)
    // boxImage = boxImage.threshold(60);
    // boxImage.save('./morphthreshold.png');

    // // boxImage = boxImage.scharrFilter();
    // // boxImage.save('./scharr.png');


    // })
}

main('./raw/summit.png');



