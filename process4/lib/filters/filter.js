const defaultOptions = require('./defaultOptions');
const methods = require('./methods');

/** pixelFilter()
 *  replaces any pixel value that doesn't meet the specified conditions. 
 *  return the modified pixels to the caller. 
 * @param  {Array<Array>}  pixels - an array of pixel values to filter
 * @param  {Array<Object>}  options - an array containing option's objects for each channel
 * @param  {String} options.name - the name of the channel to filter 
 * @param  {Object} options.condition - the conditions to filter by 
 * @param  {Number} [options.condition.upper = 100%] - any value above will be replaced 
 * @param  {Number} [options.condition.lower = 0%] - any value below will be replaced
 * @param  {Array}  [options.replacement = [0,0,0]] - replacement value for a pixel if it fails the test condition 
 * @param  {String} [options.method = 'ifAny'] - the method to filter by 'ifAny','individual','shift'
 * @return {Array}  - The modified pixels
 */
const pixelFilter = (pixels , options) => {

    // guard clause for mandatory options
    //============================================
    if(!options.name||!options.condition){
        throw new Error('missing name and/or condition option');
    }

    // get default options if necessary
    //=============================================
    options = defaultOptions(options);
    
    // actually do stuff here
    //=============================================

    // we now go through each pixel 
    references = pixels.map( pixel => {

        // set up an empty reference array
        const reference = [];

        // for each pixel, go through the options array and test against each condition
        options.forEach(option => {

            //grab the index of the channel we're testing
            index = option.channelIndex;
            //grab the value from the channel we're testing
            value = pixel[index];

            //grab the limits we're testing against
            const { upper, lower } = option.condition;
        
            if( value >= lower && value <= upper){
                // Pass, map a '1' mirroring the channelIndex
                reference[index] = 1
            } else {
                // Fail map a zero
                reference[index] = 0;
            }
        });

        // decide how to process the pixel with the defined method;
        // call upon the reference array and make a decision to pass the pixel or replace it
        pixel = methods[options.method](pixel,reference,options.replacement)

        return pixel;
    });
   
    return pixels;
}