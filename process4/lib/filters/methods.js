const methods = { 

    /** ifAny()
    * If any index in the reference array is a 0, returns the replacement array. (FAIL)
    * Otherwise returns the input pixel unaltered (PASS)
    * 
    * @param  {array} pixel - the pixel to test
    * @param  {array} reference - the reference array that will ethier pass or fail the pixel
    * @param  {array} replacement - replacement array if the pixel fails the condition
    * @return {array} either the pixel or replacement inputs
    */
  ifAny:( pixel, reference, replacement) => {
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
    * @param  {array} pixel - the pixel to test
    * @param  {array} reference - the reference array that will ethier pass or fail the pixel
    * @param  {array} replacement - replacement array if the pixel fails the condition
    * @return {array} either the pixel or replacement inputs
  */
  individual: ( pixel, reference, replacement) => {
    //check every reference
    pixel = reference.map( (test,index) => {
      
      if(test === 1 || test === undefined ){
        // if test is a PASS:1 or empty (we didn't test for it)
        // then send the value of the pixel at this index back
        return pixel[index];
      } else {
        // FAIL send back the replacement value at this index
        return reference[index];
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
   * @param  {array} pixel - the pixel to test
   * @param  {array} reference - the reference array that will ethier pass or fail the pixel
   * @param  {array} replacement - replacement array if the pixel fails the condition
   * @return {array} either the pixel or replacement inputs
   */
  ifThen: ( pixel, reference, replacement, options) => {

  },


  /** shift() //TODO: NEEDS DEVELOPMENT
    * on a FAIL, shifts hue into the allowed range.
    */
  shift: ( pixel, reference, replacement, options) => {
    //probably have everything take a named object instead?
    //hue will always be the first option defined. 
    if ( reference[0] === undefined ){
      throw new Error('Shift will only work when filtering with Hue')
    }
    //need to know the difference in upper and lower values. that we filtered by
    // if the keep range is smaller than the discard range, we will need to scale and shift the results.

  }
};

module.exports = methods;