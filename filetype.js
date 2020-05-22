const { Image } = require('image-js');

const data = [
    255,0,0,0,0,0,0,0,0,0,
    0,255,0,0,0,0,0,0,0,0,
    0,0,255,0,0,0,0,0,0,0,
    0,0,0,255,0,0,0,0,0,0,
    0,0,0,0,255,0,0,0,0,0,
    0,0,0,0,0,255,0,0,0,0,
    0,0,0,0,0,0,255,0,0,0,
    0,0,0,0,0,0,0,255,0,0,
    0,0,0,0,0,0,0,0,255,0,
    0,0,0,0,0,0,0,0,0,255
]

const testdata = [
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,255,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0
]



function rgbaConvert(data){
    newData = [];
    data.forEach(pixel => {
        newData.push(pixel,pixel,pixel,255);
    });
    return newData;
}

rgbaData = rgbaConvert(data);
testData = rgbaConvert(testdata)

newImage = new Image (10,10,rgbaData);
newImage.save(`./output/test.png`);

newImage = new Image (10,10,testData);
newImage.save(`./output/test2.png`);