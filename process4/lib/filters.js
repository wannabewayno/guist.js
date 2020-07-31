const channelsHSL = require('./filters/channelsHSL.js');
const pixelFilter = require('./filters/pixelFilter.js');
const convertRGB = require('./filters/convertRGB');
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
    Image.prototype.thresholdMask = function(options){
        //converts our image to greyscale if it isn't already.
        if(this.type !== 'GREY')  this.grey();
        // applies the mask with options
        this.mask(options);
        // return the image for method chaining
        return this
    },

    /** thresholdRGB 
     * Thresholds RGBA pixel components of an image (except Alpha) individualy. Anything under the Threshold limit is set to black.
     * ? Example 
     *  ? Input :  a pixel in our image has the colour -> RGB(122,45,87,255); our threshold -> 72 
     *  ? Output: image's pixel would now be colour -> RGB(122,0,87,255)
     * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
     * @param options object with options: [mandatory] -> threshold:number (0 - 255)
    */
    Image.prototype.thresholdRGB = function(options){
        const threshold = options.threshold;
        const channels = this.channels;
        this.data = this.data.map((pixel,index) => {
            //pixel => (R,G,B,A):4 channels, this way, we skip every 4th channel, the alpha. and threshold everything else
            if(pixel < threshold && ((index+1)/channels)%1!==0){
                return 0;
            } else {
                return pixel;
            }
        });
        return this;
    },

    /**  thresholdHSL
     *  Thresholds HSLA pixel components of an image (except alpha) individualy.
     * @param image the IJS image to process, this given by the 'Image' constructor from Image-js
     * @param options
     */
    Image.prototype.thresholdHSL = function(options) {

        //gets hsl data
        let pixels = channelsHSL(image);
    
        pixels = pixelFilter(pixels,options);

        //converts hsl back to RGB and re-writes image data
        image = convertRGB(image,pixels);

        console.log(image);

        return image;
    },
    Image.prototype.cropMultiple = function(cropOptions){
        croppedImages = cropOptions.map(cropOption => this.crop(cropOption))
        return croppedImages;
    },

    //TODO change function to Image.prototype.stats and return an object of stats -> Average, STD, etc...
    Image.prototype.average = function() {
        const sum = image.data.reduce((a,b) => a + b, 0);
        const average = sum/image.data.length;
        return average;
    },

    Image.prototype.thresholdBinary = function(threshold){
        const channels = this.channels;
        this.data = this.data.map((pixel,index) => {
            if(pixel < threshold && ((index+1)/channels)%1!==0){
                return 0;
            } else {
                return 255;
            }
        });
        return this;
    },

    Image.prototype.findRows = function() {
        const rowAverage = this.getMatrix().map((row,index) => [row.reduce((accumulator,currentValue) => accumulator + currentValue,0)/this.width,index]);
        
        const lines = rowAverage
        .filter(([value,]) => value > 90 )
        .filter(([,lineNumber],index,array) => {
        
            if(index - 1 !== -1){
                return  lineNumber !== array[index - 1][1] + 1
            } else {
                return true
            }
        })
        console.log(lines);
        const scoreBoxes = lines.map(([,lineNumber],index,array) => {
            if(index - 1 !== -1) {
                return {
                    x:0,
                    y:array[index-1][1] + 2,
                    width:this.width,
                    height: (lineNumber - array[index-1][1]) - 5
                }
            }// } else if (array.length > 2) {
            //     return {
            //         x:0,
            //         y: lineNumber - (array[index+2][1] - array[index+1][1]) + 2,
            //         width:this.width,
            //         height: (array[index+2][1] - array[index+1][1]) - 5
            //     }
            // }
        })

        if(!scoreBoxes[0]) scoreBoxes.shift() 

        // all heights
        const heights = scoreBoxes.map(scoreBox => scoreBox.height);

        // unique heights
        const uniqueHeights = [...new Set(heights)];
        console.log(uniqueHeights);

        const counts = uniqueHeights.map(number => {
            console.log(number);
            const count = heights.join(' ').match(new RegExp(String(number),'g')).length;
            console.log(count);
            return [number, count]
        });

        const modeHeight = counts.find(([,count]) => count === Math.max(...counts.map(([,thisCount])=>thisCount)))[0]
        console.log('MAXCOUNT',modeHeight);

        scoreBoxes.forEach(scoreBox => {
            scoreBox.y += scoreBox.height - modeHeight;
            scoreBox.height = modeHeight;
        });

        console.log(scoreBoxes);

        const topBox = { ...scoreBoxes[0] };
        topBox.y -= topBox.height + 2;
        scoreBoxes.unshift(topBox)

        console.log(scoreBoxes);
        // returns an array of y1,y0 values that defines positions of rows
        return scoreBoxes
    }
}