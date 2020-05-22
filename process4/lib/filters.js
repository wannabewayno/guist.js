const channelsHSL = require('./filters/channelsHSL.js');
const { filter } = require('./filters/helpers.js');
const { convertRGB } = require('./filters/channelsRGB');
const Fn = {};

/** thresholdBinary
 * Binary mask threshold method, anything under the threshold, set to black, anything above, set to white. Completely binary
 * ?Example
 *  ? Input(greyscale only): two different pixels in our greyscale image has intensities -> (72,255) , (134,255); threshold -> 102
 *  ? Output (binary image): the same pixels would now have intensities -> (0,255) , (255,255);
 * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
 * @param options object with options: [mandatory] -> threshold:number (0 - 1), [optional] -> algorithim:string (algorithm to use default:'threshold'), invert:booloean, useAlpha:boolean
 */
    
Fn.thresholdBinary = (image,options) => {
    //converts our image to greyscale if it isn't already.
    //TODO run a check for this first, an image should have a property type:'GREY' or something 
    image = image.grey();
    image = image.mask(options)
    return image
};

/** thresholdRGB 
 * Thresholds RGBA pixel components of an image (except Alpha) individualy. Anything under the Threshold limit is set to black.
 * ? Example 
 *  ? Input :  a pixel in our image has the colour -> RGB(122,45,87,255); our threshold -> 72 
 *  ? Output: image's pixel would now be colour -> RGB(122,0,87,255)
 * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
 * @param options object with options: [mandatory] -> threshold:number (0 - 255)
*/
Fn.thresholdRGB = (image,options) => {
    const threshold = options.threshold;
    const channels = image.channels;
    image.data = image.data.map((pixel,index) => {
        //pixel => (R,G,B,A):4 channels, this way, we skip every 4th channel, the alpha. and threshold everything else
        if(pixel < threshold && ((index+1)/channels)%1!==0){
            return 0;
        } else {
            return pixel;
        }
    });
    return image;
}

/**  thresholdHSL
 *  Thresholds HSLA pixel components of an image (except alpha) individualy.
 * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
 * @param options
 */
Fn.thresholdHSL = (image,options) => {
    console.log(image);

    //gets hsl data
    pixelsArray = channelsHSL(image);
    // console.log(channels);

    //filters it with our options;
    // channels = filter(channels,options);

    //filter the pixelsArray with our options
    // with this scheme, anything that does't pass the test will be set to black
    pixelsArray = pixelsArray.map(pixel => {
        [ hue, saturation, lightness] = pixel;

        // if(options.hue!==undefined){
        //     const { lower, upper } = options.hue;
        //     if(hue >= lower && hue <= upper){
        //         return [hue,saturation,lightness];
        //     } else {
        //         return [0,0,0];
        //     }
        // }

        // if(options.saturation!==undefined){
        //     const { lower, upper } = options.saturation;
        //     if(saturation >= lower && saturation <= upper){
        //         return [hue,saturation,lightness];
        //     } else {
        //         return [0,0,0];
        //     }
        // }

        if(options.lightness!==undefined){
            const { lower, upper } = options.lightness;
            if(lightness >= lower && lightness <= upper){
                return [hue,saturation,lightness];
            } else {
                return [0,0,0];
            }   
        }
        
    })
    

    //converts hsl back to RGB and re-writes image data
    image = convertRGB(image,pixelsArray);

    console.log(image);

    return image;
}


//TODO change function to Fn.stats and return an object of stats -> Average, STD, etc...
Fn.average = image => {
    const sum = image.data.reduce((a,b) => a + b, 0);
    const average = sum/image.data.length;
    return average;
}

module.exports = Fn;