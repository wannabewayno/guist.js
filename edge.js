const cannyEdgeDetector = require('canny-edge-detector');
const { Image } = require('image-js');

 
const options={
    lowThreshold:60,
    highThreshold:100,
    gaussianBlur:2
}

Image.load('./images/gamertag1.jpg').then((img) => {
  const grey = img.grey();
  const edge = cannyEdgeDetector(grey,options);
  return edge.save('test1.png');
})
