const clamped360 = require('./clamped360');
const shiftHue = require('./shiftHue');
const scaleHue = require('./scaleHue');

const methods = { 

    /** ifAny()
    * If any index in the reference array is a 0, returns the replacement array. (FAIL)
    * Otherwise returns the input pixel unaltered (PASS)
    * 
    * @param  {Array} pixel - the pixel to test
    * @param  {Array} reference - the reference array that will ethier pass or fail the pixel
    * @param  {Object} options - options object from pixelFilter, contains the replacement variable
    * @return {Array} either the pixel or replacement inputs
    */
  ifAny:( pixel, reference, options) => {

    const { replacement } = options 
    //for this method, if any channel fails, we fail the entire pixel.
    // hence if any 0's are in the reference array, we fail this pixel
    if (reference.indexOf(0) === -1){

      //PASS: send back the pixel
      return pixel

    } else {

      //FAIL: send back the replacement
      return replacement

    }
  },


  /** individual()
    * If any index in the reference array is a 0, replaces the value in pixel at that index with the one in the replacement array. (FAIL)
    * Otherwise returns pixel value at that index unaltered (PASS)
    * @param  {Array} pixel - the pixel to test
    * @param  {Array} reference - the reference array that will ethier pass or fail the pixel
    * @param  {Object} options - options object from pixelFilter, contains the replacement variable
    * @return {Array} either the pixel or replacement 
  */
  individual: ( pixel, reference, options ) => {
    const { replacement } = options
    //check every reference
    pixel = reference.map( (test,index) => {
      
      if(test === 1 || test === undefined ){

        // PASS: if test is a 1 or empty (we didn't test for it)
        // then send the value of the pixel at this index back
        return pixel[index];

      } else {

        // FAIL send back the replacement value at this index
        return replacement[index];
      } 
    });

    //return the altered pixel
    return pixel;
  },


  /**ifThen() //TODO: UNDER CONSTRUCTION
   * if a value in target channel fails, then modify other channels
   * ? Example:
   * ? if all yellow pixels fail (hue between 30 and 60), 
   * ? then change the saturation and/or lightness of this pixel.
   * @param  {Array} pixel - the pixel to test
   * @param  {Array} reference - the reference array that will ethier pass or fail the pixel
   * @param  {Object} options - options object from pixelFilter, contains the replacement variable
   * @return {Array} either the pixel or replacement inputs
   */
  ifThen: ( pixel, reference, options) => {

  },


  /** shift() //TODO: NEEDS DOCUMENTATION -> heavy on theory
    * on a FAIL, shifts hue into the allowed range.
    * @param  {Array} pixel - the pixel to test
    * @param  {Array} reference - the reference array that will either pass or fail the pixel
    * @param  {Object} options - options object from pixelFilter
    * @return {Array} - returns the pixel either with a shifted hue or unaltered. 
    */
  shift: ( pixel, reference, options) => {
    
    //hue will always be the first option defined. 
    if ( reference[0] === undefined ) {

      throw new Error('Shift will only work when filtering with Hue')

    }
    
    // find the option associated with hue
    let hueOption;
    options.conditions.forEach(condition => {
      if ( condition.name === 'H' ) {
        hueOption = condition;
      }
    });
    
    // if reference is 0, we tested for hue and it failed the conditions, so shift it
    if ( reference[0] === 0 ) {

      const { upper, lower } = hueOption;
      let hue = pixel[0];
      
      if ( clamped360( upper - lower ) > 180 ) {
        hue = shiftHue( hue, hueOption );
      } else {
        const scaledHue = scaleHue( hue, hueOption );
        hue = shiftHue( scaledHue, hueOption )
      }
      //overide the pixel hue with our new value
      pixel[0] = hue;
    }
    //return the pixel back to the block
    return pixel;
  }
};

module.exports = methods;