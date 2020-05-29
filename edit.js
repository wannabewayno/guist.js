// JavaScript code using Node.js to get some info about the image.
// We load the library that was installed using 'npm install image-js'
const Fn = require('./process4/lib/filters.js');
const { Image } = require('image-js');

const options = {
  method:'shift',
  conditions:[
      { name:'H', lower:329, upper:330, direction:'anti-clockwise', },
  ]
}
// Loading an image is asynchronous and will return a Promise.
Image.load('./process4/raw/SB3cropped.png').then( image => {
  
  image.save('output1.png')

  image = Fn.thresholdHSL(image,options)
    
  image.save('output2.png');

});

