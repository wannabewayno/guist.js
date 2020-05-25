const { scaleHueClockwise, scaleHueAntiClockwise } = require('./scaleHue');

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


  /** shift() //TODO: NEEDS MODULARISATION and DOCUMENTATION -> heavy on theory
    * on a FAIL, shifts hue into the allowed range.
    */
  shift: ( pixel, reference, replacement, options) => {
    
    //hue will always be the first option defined. 
    if ( reference[0] === undefined ){
      throw new Error('Shift will only work when filtering with Hue')
    }

    if ( reference[0] === 0 ) {
      shiftPixel()
    }
    // find the option assocaited with hue
    let hueOption;
    for (const option in options) {

      if ( options[option].name === 'hue' ) {
        hueOption = options[option];
      }

    }
    // grab the boundary conditions specified
    const { upper, lower} = hueOption.condition;
    //clockwise or anti-clockwise phase shift
    const { direction } = hueOption.direction;

    // define the shift magnitude, the minimum phase required to shift
    // any colour in the excluded region into the allowed region.
    const shiftMagnitude = Math.abs( upper - lower );

    //if we need to scale
    const scaleFactor = ( 360 / shiftMagnitude ) - 1;

    //TODO: this can be simplified using phasors, and wave addition
    // we have eight possible cases to consider
    if ( shiftMagnitude < 180 ) {

      if ( upper < lower ) {
        //* case 1
        if ( direction === 'clockwise' ) {
          pixel[0] -= shiftMagnitude;

        } else { //anti-clockwise
          pixel[0] += shiftMagnitude;

        }

      } else { //upper > lower
        //* case 3
        if ( direction === 'clockwise' ) {

          const scaledHue = scaleHueClockwise( pixel[0], scaleFactor, upper, lower );
          pixell[0] -= scaledHue; 

        } else { //anti-clockwise

          const scaledHue = scaleHueAntiClockwise( pixel[0], scaleFactor, upper, lower );
          pixel[0] += scaledHue

        }

      }
    } else { //shiftMagnitude > 180

      if ( upper < lower ) {
        // * case 2
        if ( direction === 'clockwise' ) {

          const scaledHue = scaleHueClockwise( pixel[0], scaleFactor, upper, lower );
          shiftedHue = scaledHue - shiftMagnitude;
          if (shiftedHue <= 0){
            pixel[0] = 360 - shiftedHue;
          } else {
            pixel[0] = shiftedHue;
          }

        } else {

          //anti-clockwise
          const scaledHue = scaleHueAntiClockwise( pixel[0], scaleFactor, upper, lower );
          const shiftedHue = scaledHue + shiftMagnitude;

          if (shiftedHue >= 360){
            pixel[0] = 0 + shiftedHue;
          } else {
            pixel[0] = shiftedHue;
          }

        }

      } else { //upper > lower
        // * case 4
        if ( direction === 'clockwise' ) {

          const shiftedHue = pixel[0] - shiftMagnitude;

          if ( shiftedHue <= 0 ) {
            pixel[0] = 360 - shiftedHue; 
          } else {
            pixel[0] = shiftedHue;
          }

        } else { // anti-clockwise
          
          const shiftedHue = pixel[0] + shiftMagnitude;

          if ( shiftedHue <= 360 ) {
            pixel[0] = 0 + shiftedHue; 
          } else {
            pixel[0] = shiftedHue;
          }

        }

      }
    }
    return pixel;
  }
};

module.exports = methods;