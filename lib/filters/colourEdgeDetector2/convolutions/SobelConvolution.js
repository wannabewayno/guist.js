module.exports = function(pixels, direction) {// we pass in a regionOfInterest as pixels which looks like
    /*
    * regionOfInterest (pixels) is a 3x3 Colour Pixel grid;
    * pixels = [
    * [[H,S,L],[H,S,L],[H,S,L]],
    * [[H,S,L],[H,S,L],[H,S,L]],
    * [[H,S,L],[H,S,L],[H,S,L]],
    * ]
    */
   switch (direction){
       case'x':{
           /* We Want difference in the X direction
           * |00 01 02| . |1 0 -1| -> 1|00 - 02| 
           * |10 11 12| . |2 0 -2| -> 2|10 - 12|
           * |20 21 22| . |1 0 -1| -> 1|20 - 22|
           */
            return [
               [1, pixels[0][0], pixels[0][2] ],
               [2, pixels[1][0], pixels[1][2] ],
               [1, pixels[2][0], pixels[2][2] ],
            ]      
       }
       case'y':{
           /* We Want difference in the Y direction
           * |00 01 02| . | 1  2  1| -> 1|00 - 20| 
           * |10 11 12| . | 0  0  0| -> 2|01 - 21|
           * |20 21 22| . |-1 -2 -1| -> 1|02 - 22|
           */
            return [
               [1, pixels[0][0], pixels[2][0] ],
               [2, pixels[0][1], pixels[2][1] ],
               [1, pixels[0][2], pixels[2][2] ],
            ]    
       }
   }
}