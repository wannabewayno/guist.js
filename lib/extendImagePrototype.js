const RGB2HSL = require('./filters/RGB2HSL.js');
const HSL2RGB = require('./filters/HSL2RGB');
const { Image } = require('image-js');

module.exports = function(){

    /** thresholdBinary
     * Binary mask threshold method, anything under the threshold, set to black, anything above, set to white. Completely binary
     * ?Example
     *  ? Input(greyscale only): two different pixels in our greyscale image has intensities -> (72,255) , (134,255); threshold -> 102
     *  ? Output (binary image): the same pixels would now have intensities -> (0,255) , (255,255);
     * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
     * @param options object with options: [mandatory] -> threshold:number (0 - 1), [optional] -> algorithim:string (algorithm to use default:'threshold'), invert:booloean, useAlpha:boolean
     */
    Image.prototype.thresholdMask = function(threshold){
        let image = this.clone()
        // map threshold to a [0,1] range
        threshold = threshold/255

        //converts our image to greyscale if it isn't already.
        if(image.colorModel !== 'GREY') image = image.grey();

        // applies the mask with options
        image = image.mask({algorithm:'threshold',threshold,useAlpha:true,invert:true});

        // return the image for method chaining
        return image
    },

    Image.prototype.invert = function(){
        let image = this.clone();
        image.data = image.data.map(pixel => 127.5 - (pixel - 127.5))
        return image
    },

    /** thresholdRGB 
     * Thresholds RGBA pixel components of an image (except Alpha) individualy. Anything under the Threshold limit is set to black.
     * ? Example 
     *  ? Input :  a pixel in our image has the colour -> RGB(122,45,87,255); our threshold -> 72 
     *  ? Output: image's pixel would now be colour -> RGB(122,0,87,255)
     * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
     * @param options object with options: [mandatory] -> threshold:number (0 - 255)
    */
    Image.prototype.thresholdRGB = function(threshold){
        const image = this.clone();
        let pixels = image.getPixelsArray();

        // map each pixel to the filtered pixel
        pixels = pixels.map((pixel,index) => {
            // map each channel to the filtered channel
            return [ 
                ...pixel.map(channel => {
                    if(channel < threshold) return 0;
                    else return channel;
                }),
                255  // puts the alpha back in
            ]

        });

        image.data = pixels.flat();
        return image;
    },

      /** convertRGB
     * takes in a channel object and converts them to the RGB colourModel
     * @param {Object} channels: a channels object { <channelName>:<array>, <channelName>:<array>, <channelName>:<array> }
     * @param {Image}  image
     * @param {Image}  image
     */
    Image.prototype.convertRGB = function(pixels) {
        const image = this.clone();

        //map pixels into HSL2RGB
        pixels = pixels.map(pixel => HSL2RGB(...pixel));
        
        //then split that again into 3 1D channels
        // channels = split(pixels,'RGB');

        // //convert this to matrix form
        // channelMatrix = matrixForm(channels,image);
        
        // //set the appropriate components with the appropriate channels
        // image.setMatrix(channelMatrix.red,{channel:0})
        // image.setMatrix(channelMatrix.green,{channel:1})
        // image.setMatrix(channelMatrix.blue,{channel:2})

        image.data = pixels.flat();

        //finally return the image
        return image
    },

    Image.prototype.threshold = function(threshold){
        if(this.colorModel!=='GREY') throw new Error('Threshold: Image needs to be monochromatic, try using image.grey() before this!')
        const image = this.clone();
        image.data = image.data.map(pixel=> pixel < threshold?0:pixel);
        return image;
    },
    
    /** convertHSL
     * Takes in an image and returns the HSL channels.
     * @param  {Image} image
     * @return {object} returns an object with a 1D array of each HSL channel { hue:<array>, saturation:<array>, lightness:<array> } 
     */

    Image.prototype.toHSL = function() {
        const image = this.clone();

        //get the RGB pixel array from the image
        const pixelsRGB = image.getPixelsArray()

        //map over every pixel and convert it to HSL
        const pixelsHSL = pixelsRGB.map(pixel => RGB2HSL(...pixel).map(([H,S,L]) => {
            // HSL values are in the Ranges H[0,360), S[0,100], L[0,100];
            // We convert them all to [0,255] for an Uint8Array;
            return Uint8Array.from([
                Math.round(H*255/360),
                Math.round(S*255/100),
                Math.round(L*255/100),
            ])
        }));
        image.data = Uint8Array.from(pixelsHSL.flat());
        image.colorModel = 'HSL';

        return image
    },

    /**  thresholdHSL
     *  Thresholds HSL pixel components of an image individualy.
     * @param {Object} conditions
     * @param {Object} [conditions.H] -
     * @param {Object} [conditions.H.upper] - anything above this limit will be set to black 
     * @param {Object} [conditions.H.lower] - anything lower than this limit will be set to black
     * @param {Object} [conditions.S] 
     * @param {Object} [conditions.S.upper] - anything above this limit will be set to black 
     * @param {Object} [conditions.S.lower] - anything lower than this limit will be set to black
     * @param {Object} [conditions.L] 
     * @param {Object} [conditions.L.upper] - anything above this limit will be set to black 
     * @param {Object} [conditions.L.lower] - anything lower than this limit will be set to black
     * 
     */
    Image.prototype.thresholdHSL = function(conditions) {
        let image = this.clone();

        //gets hsl data
        let pixels = image.channelsHSL();

        const { H , S , L, type } = conditions;

        // threshold them 
        pixels = pixels.map(pixel => {
            const black = [0,0,0]
            switch(type){
                case'ifAny': // if any test fail return black
                    if(H) {
                        const { lower, upper } = H
                        if(lower && pixel[0] < lower || upper && pixel[0] > upper ) return black;
                    }   
                    if(S) {
                        const { lower, upper } = S
                        if(lower && pixel[1] < lower || upper && pixel[1] > upper ) return black;
                    }
                    if(L) {
                        const { lower, upper } = L
                        if(lower && pixel[2] < lower || upper && pixel[2] > upper ) return black; 
                    }
                    return pixel

                case'ifAll': // if all tests fail return black, if only some tests fail the pixel will still be returned

                    let numberOfConditionsToPass = [H,S,L].filter(channel => channel !== undefined).length;
                
                    if(H) {
                        const { lower, upper } = H
                        if(lower && pixel[0] < lower || upper && pixel[0] > upper) numberOfConditionsToPass--;
                    }
                    if(S) {
                        const { lower, upper } = S
                        if(lower && pixel[1] < lower || upper && pixel[1] > upper ) numberOfConditionsToPass--;
                    }
                    if(L) {
                        const { lower, upper } = L
                        if(lower && pixel[2] < lower || upper && pixel[2] > upper ) numberOfConditionsToPass--; 
                    }

                    return numberOfConditionsToPass === 0 ? black : pixel;

                default: throw new Error('thresholdHSL ERROR: you never defined a recognised type! \n',
                    'Tell thresholdHSL how to pass or fail pixels by passing a type -> conditons.type:String',
                    'Accepted types are "ifAny"|"ifAll"',
                    '"ifAny": if any of the tests fail, the entire pixel fails',
                    '"ifAll: if all the tests fail, the pixel fails')
            }
        })
        //converts hsl back to RGB and re-writes image data
        image = image.convertRGB(pixels);

        return image;
    },

    Image.prototype.hueCount = function(range) {
        let image = this.clone();
    
        let count = 0;
        const pixels = image.channelsHSL();
        const [lower, upper] = range;
        pixels.forEach(pixel => {
            const [hue, saturation, lightness] = pixel;
            switch(lower < upper) {
                case true:
                    if(hue >= lower && hue <= upper){
                        count ++;
                    }
                    break;
                case false:
                    if(hue >= lower || hue <= upper){
                        count ++;
                    }
                    break;
            }
        })
        return count;
    },

    Image.prototype.adjustHue = function(range) {
        image = this.clone();

        let pixels = image.channelsHSL();
        const [lower, upper] = range;

        pixels = pixels.map(pixel => {
            const [hue, saturation, lightness] = pixel;
            
            if(hue >= lower && hue <= upper){
                const newSaturation = saturation * 0.2
                const newLigthness = lightness * 1.5
                return [ 
                    hue,
                    newSaturation > 100? 100 : newSaturation,
                    newLigthness > 100? 100 : newLigthness
                ]
            }
            return pixel
        })
        image = image.convertRGB(pixels);

        return image;
    },

    Image.prototype.cropMultiple = function(cropOptions){
        croppedImages = cropOptions.map(cropOption => this.crop(cropOption))
        return croppedImages;
    },

    Image.prototype.average = function() {
        let image = this.clone();

        image = image.grey({keepAlpha:false})
        const reducer = (a,b) => a + b;
        
        const sum = image.data.reduce(reducer,0);
        const average = sum/image.data.length;

        return average;
    },

    Image.prototype.std = function() {
        let image = this.clone();
        const mean = image.average();

        image = image.grey({keepAlpha:false})
        const length = image.data.length;
        const reducer = (a,b) => a + b;

        const variance = image.data
            .map(pixel=> Math.pow(pixel - mean,2))
            .reduce(reducer,0)/length;

        const std = Math.pow(variance,0.5);

        return std;
    },

    Image.prototype.stats = function(){
        let image = this.clone();
        const average = image.average(); 
        const std = image.std();
        return { average , std };
    },

    Image.prototype.thresholdBinary = function(threshold){
        const image = this.clone();
        let pixels = image.getPixelsArray();

        // map each pixel to the filtered pixel
        pixels = pixels.map(pixel => {

            // map each channel to the filtered channel
            return pixel.map(channel => {
                if(channel < threshold) return 0;
                else return 255;
            })
        });

        image.data = pixels.flat();
        return image;
    },

    Image.prototype.luma = function(luma) {
        const image = this.clone();
        if(image.colorModel !== 'RGB') throw new Error('Image is not in RGB!');

        let pixels = image.getPixelsArray();

        // map each pixel to the filtered pixel
        pixels = pixels.map(([R,G,B],i) => {
            switch(luma) {
                case'601':  { return Math.round(0.2989 * R + 0.5870 * G + 0.1140 * B) } // SDTV      standard
                case'240':  { return Math.round(0.2120 * R + 0.7010 * G + 0.0870 * B) } // Adobe     standard
                case'709':  { return Math.round(0.2126 * R + 0.7152 * G + 0.0722 * B) } // HDTV      standard
                case'2020': { return Math.round(0.2627 * R + 0.6780 * G + 0.0593 * B) } // UHDTV HDR standard
                default: throw new Error(`luma of ${luma} not recognised`)
            }
        });
        image.colorModel = 'GREY';
        image.size = image.width * image.height;
        image.alpha = 0;
        image.components = 1;
        image.channels = 1;
        image.multiplyerX = image.channels;
        image.multiplyerY = image.size*image.channels/image.height;
        image.data = pixels.flat();
        return image;
    },

    Image.prototype.channel = function(channel){
        const image = this.clone();
        let pixelsHSL = image.channelsHSL();

        switch(channel){
            case'hue':        pixelsHSL = pixelsHSL.map(([H,S,L]) => {
                // a trick, we only want the difference in hue...hence hue > 180 will now be equal distance from 0 as numbers < 180;
                // if(H > 180) H -= 360;
                // if grey, black or white, no hue can't be determined, for convienence set to 90 (middle of the road);
                if(S <= 1 ||L <= 1 || L >= 98) H = 180; 
                return Math.round(Math.abs(H)*255/360);
            }); break;
            case'saturation': pixelsHSL = pixelsHSL.map(([H,S,L]) => Math.round(S*255/100)); break;
            case'lightness':  pixelsHSL = pixelsHSL.map(([H,S,L]) => Math.round(L*255/100)); break;
        }

        image.colorModel = 'GREY';
        image.size = image.width * image.height;
        image.alpha = 0;
        image.components = 1;
        image.channels = 1;
        image.multiplyerX = image.channels;
        image.multiplyerY = image.size*image.channels/image.height;
        image.data = pixelsHSL.flat();
        return image;
    }
}