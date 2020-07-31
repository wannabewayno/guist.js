const defaultOptions = require('./defaultOptions');
const methods = require('./methods');

/** pixelFilter()
 *  replaces any pixel value that doesn't meet the specified conditions. 
 *  return the modified pixels to the caller. 
 * @param  {Array<Array>}  pixels - an array of pixel values to filter
 * @param  {Object}  options - a configuration object
 * @param  {String} [options.method = 'ifAny'] - the method to filter by: 'ifAny','individual','ifThen','shift'
 * @param  {Array}  [options.replacement = [0,0,0]] - replacement value for a pixel if it fails the test condition 
 * @param  {Array<Object>} options.conditions - array containing condition objects to filter by 
 * @param  {String} options.conditions.name - the name of the channel to filter 
 * @param  {Number} [option.condition.upper = 100%] - upper limit: any value above this will be replaced 
 * @param  {Number} [option.condition.lower = 0%] - lower limit: any value below will be replaced
 * @return {Array}  - The modified pixels
 */
const pixelFilter = ( pixels , options ) => {

    // guard clause for mandatory options
    //============================================
    if( !options.conditions ) {
        // Make sure user has set conditions to filter by, otherwise throw an error
        throw new Error(`missing filter conditions from the options object. Can't filter without setting a condition to filter by`);
    } else {
        // Go through each conditon, make sure user has set a name parameter for each conditon.
        options.conditions.forEach(condition => {
            //go through the each condition object and check for a name key
           const parameters = Object.keys(condition);
           if ( parameters.indexOf('name') === -1 ) {
               // if -1, no name key was found, throw an error
               throw new Error(`No name reference in setting filter conditions, The pixelFilter function requires a Name for each condition to apply that condition to the appropriate channel.`)
           }
        });
    }

    // set default options if necessary
    //=============================================
    options = defaultOptions( options );
    
    // actually do stuff here
    //=============================================

    const { method } = options

    // we now test each pixel, and map it to a replacement if it fails our test conditions
    // otherise, we map it to itself 
    pixels = pixels.map( pixel => {

        // set up an empty reference array
        const reference = [];
        reference.length = pixel.length;

        // for each pixel, go through the conditions array and test against each condition
        options.conditions.forEach(condition => {

            //grab the index of the channel we're testing
            const index = condition.channelIndex;
            //grab the value from the channel we're testing
            const value = pixel[index];
            

            //grab the limits we're testing against
            const { upper, lower } = condition;
            // if(value >= lower){
            //     console.log('VALUE GREATER THAN LOWER')
            // }
            // if(value <= upper){
            //     console.log('VALUE LESS THAN LOWER')
            // }
            
        
            if ( value >= lower && value <= upper ) {
                // PASS: map a '1' mirroring the channelIndex
                reference[index] = 1
            } else {
                // FAIL: map a zero
                reference[index] = 0;
            }
        });

        // decide how to process the pixel with a method;
        // call upon the reference array and make a decision to pass the pixel or replace it
        pixel = methods[method]( pixel, reference, options )

        return pixel;
    });
   
    return pixels;
}

module.exports = pixelFilter;