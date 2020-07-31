const { Matrix } = require("ml-matrix");
const { Image }  = require('image-js');

module.exports = {

    /** 
     * We split an array of arrays into a number of separate arrays defined by channels 
     * @param {array} array [<array>,<array>,<array>,...,<array>]
     * @param {number} channels
     */
    split: (pixelsArray,colourMode) => {
        // the length of any pixel array will be the number of channels. So check the first one.
        const channels = pixelsArray[0].length;

        // we set up a placeholder array to push values into. [ [], [], [] ] (e.g if three channels)
        splitArray = [];
        for (let i = 0; i < channels; i++) {
            splitArray.push([]);
        }
        
        // we map over the empty array and map values into each channel placeholder
        splitArray = splitArray.map((channel,index) => {
            pixelsArray.forEach(subArray => {
                channel.push(subArray[index]);
            });
            return channel; 
        });

        switch(colourMode){
            case('HSL'): {
                return { hue:splitArray[0], saturation:splitArray[1], lightness:splitArray[2] };
            }
            case('RGB'): {
                return { red:splitArray[0], green:splitArray[1], blue:splitArray[2] };
            }
            case('HSLA'): {
                return { hue:splitArray[0], saturation:splitArray[1], lightness:splitArray[2], alpha:splitArray[3] };
            }
            case('RGBA'): {
                return { red:splitArray[0], green:splitArray[1], blue:splitArray[2], alpha:splitArray[3] };
            }
            case('HSV'): {
                return { hue:splitArray[0], saturation:splitArray[1], value:splitArray[2] };
            }
            case('HSVA'): {
                return { hue:splitArray[0], saturation:splitArray[1], lightness:splitArray[2], alpha:splitArray[3] };
            }
            //TODO
            // case('CMYK'): {
            //     return { };
            // }
        }
    },


    /** combine
     * combines an object of named channels into a pixelsArray
     * @param {object} channels { <channelName1>:<array>, <channelName2>:<array>,<channelName3>:<array>} 
     * @return {array} [[channel1,channel2,channel3],[channel1,channel2,channel3],...,[channel1,channel2,channel3]]
     * 
     */
    combine: channels => {
        channelsKeys = Object.keys(channels);
        const pixelNumber = channels[channelsKeys[0]].length;

        pixelsArray = [];
        for (let i = 0; i < pixelNumber; i++) {      
            const pixel = channelsKeys.map(key => channels[key][i]);
            pixelsArray.push(pixel);
        }

        return pixelsArray;
    },


    /** matricForm()
     *  
     * @param  {object} channels
     * @param  {Image}  image
     * @return {object} Returns an object with <channelName>:<matrix>, the matrix will be exact width and height 
     */
    matrixForm: (channels, image) => {

        const { height, width } = image;

        for (const channel in channels){

            const matrix = new Matrix(height,width)
            
            let x = 0;
            let y = 0;

            channels[channel].forEach(value => {
                if (y >= image.width) {
                    y = 0;
                    x ++;
                }
                matrix.set(x,y,value)
                y++;
            });
            channels[channel] = matrix;
        }

        return channels 
    }
}