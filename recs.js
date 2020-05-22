const { createWorker } = require('tesseract.js');
const { Image } = require('image-js');

function crop(cropBoxes){
    cropBoxes.forEach(box => {
        
    });

}

const gamerTag = {
    left: 200,
    top: 171,
    width: 300,
    height: 24
}
const score = {
    left: 598,
    top: 171,
    width: 300,
    height: 24
}
const gap =5;

class Region {
    constructor(object){
        this.left = object.left;
        this.top = object.top;
        this.width = object.width;
        this.height = object.height;
    }
}

function createBoxes(numberOfBoxes){
    boxesArray = [];
    for (let i = 0; i < numberOfBoxes; i++) {
        box = new Region(gamerTag);
        box.top += (box.height+gap)*i;
        boxesArray.push(box);
    }
    return boxesArray;
}
boxes = createBoxes(6);
console.log(boxes);

const worker = createWorker();
const rectangles = boxes;

Image.load('./images/image-processing.jpg').then(function (image) {

});

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const values = [];
  for (let i = 0; i < rectangles.length; i++) {
    const { data: { text } } = await worker.recognize('./images/image-processing.jpg', { rectangle: rectangles[i] });
    values.push(text);
  }
  console.log(values);
  await worker.terminate();
})();