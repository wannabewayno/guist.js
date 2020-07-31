const RGB2HSL = require('./filters/RGB2HSL.js');
const HSL2RGB = require('./filters/HSL2RGB');
const { split, matrixForm } = require('./filters/helpers.js');
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
        const image = this.clone()
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
        channels = split(pixels,'RGB');

        //convert this to matrix form
        channelMatrix = matrixForm(channels,image);
        
        //set the appropriate components with the appropriate channels
        image.setMatrix(channelMatrix.red,{channel:0})
        image.setMatrix(channelMatrix.green,{channel:1})
        image.setMatrix(channelMatrix.blue,{channel:2})

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

    Image.prototype.channelsHSL = function() {
        const image = this.clone();

        //get the RGB pixel array from the image
        const pixelsRGB = image.getPixelsArray()

        //map over every pixel and convert it to HSL
        const pixelsHSL = pixelsRGB.map(pixel => RGB2HSL(...pixel));

        //splits the 1D array of pixel arrays into it's seperate 1D channels
        // const channels = split(pixelsHSL,'HSL');

        //return HSL pixelsData.
        return pixelsHSL
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
            if(hue >= lower && hue <= upper){
                count ++;
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
        let image = this.clone();
        const channels = image.channels;
        image = image.data.map((pixel,index) => {
            if(pixel < threshold && ((index+1)/channels)%1!==0){
                return 0;
            } else {
                return 255;
            }
        });
        return image;
    },

    Image.prototype.findRows = function() {
        let boxImage = this.clone();
        
        // detects rows
        boxImage = boxImage.scharrFilter();
        boxImage.save('./scharr.png');

        // convert to grey image
        boxImage = boxImage.grey({keepAlpha:true});

        // if under threshold set to black(0) otherwise set to white (255)
        boxImage = boxImage.threshold(180)
        boxImage.save('./threshold.png');
        console.log('Height', boxImage.height)
        
        // reduces rows to 1 pixel with an intensity value equal to the average of all pixels in the row
        const rowAverage = boxImage.getMatrix().map((row,index) => [row.reduce((accumulator,currentValue) => accumulator + currentValue,0)/this.width,index]);
        
        const lines = rowAverage
        .filter(([value,]) => value > 180 )
        .filter(([,lineNumber],index,array) => {
        
            if(index - 1 !== -1){
                return  (lineNumber !== array[index - 1][1] + 1 && lineNumber < this.height - 10)
            } else {
                return true
            }
        })
        
        let scoreBoxes = lines.map(([,lineNumber],index,array) => {
            if(index - 1 !== -1) {
                return {
                    x:0,
                    y:array[index-1][1],
                    width:this.width,
                    height: (lineNumber - array[index-1][1])
                }
            }
        })
        .filter(line => line)
        .filter(({height,y}) => height > 5 && y > 10)

        if(!scoreBoxes[0]) scoreBoxes.shift()
        console.log(scoreBoxes);

        // special case for team on the bottom, will have a large heigth value
        // let's target this and crop it's x-axis slightly to not resolve the partial 0;
        const MaxHeight = Math.max(...scoreBoxes.map(({height}) => height))
        scoreBoxes = scoreBoxes.map(scoreBox => {
            let { x, width, height } = scoreBox;
            if (height === MaxHeight){
                x += 20
                width -=700
                return {...scoreBox, x, width}
            } else {
                return scoreBox;
            }
        })

        // all heights
        const heights = scoreBoxes.map(scoreBox => scoreBox.height);

        // unique heights
        const uniqueHeights = [...new Set(heights)];

        const counts = uniqueHeights.map(number => {
            const count = heights.join(' ').match(new RegExp(String(number),'g')).length;
            return [number, count]
        });

        const modeHeight = counts.find(([,count]) => count === Math.max(...counts.map(([,thisCount])=>thisCount)))[0]

        scoreBoxes = scoreBoxes.map(scoreBox => {
            scoreBox.y += (scoreBox.height - modeHeight) + 5;
            scoreBox.height = modeHeight - 5;
            return scoreBox
        });

        const topBox = { ...scoreBoxes[0] };
        topBox.y -= topBox.height + 5;
        topBox.x += 20;
        topBox.width -= 20;

        scoreBoxes.unshift(topBox)

        return scoreBoxes
    }
}