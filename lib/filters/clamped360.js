/** clamped360()
 * clamps an angle outside of [0,360] back into [0,360]
 * ? Example : clamped360(420) -> 60
 * ? Example : clamped360(-60) -> 300
 * @param  {Number} angle
 * @return {Number} - returns the clamped angle 
 */
module.exports = angle => {
    if( angle < 0 ) {
        angle +=360
    } else if ( angle   > 360 ) {
        angle -=360
    }
    return angle 
 }