const { Matrix } = require('ml-matrix');

module.exports = function(mode, image) {

    // clone for immutability
    const imageClone = image.clone();

    const { width, height } = imageClone;
    // Pixels in HSL
    const pixels = imageClone.toHSL().pixelsArray();
    
    const Gx = Matrix.zeros(width,height);
    const Gy = Matrix.zeros(width,height);

    pixels.forEach((row,i) => {
        row.forEach((_,j)=> {
            const regionOfInterest = createROI(pixels,i,j,3,3);

            // Compute Gx
            Gx[i][j] = convolvePixel( regionOfInterest, { mode, direction:'x'});

            // Compute Gy 
            Gy[i][j] = convolvePixel( regionOfInterest, { mode, direction:'y'});
        })
    })
    return { Gx,Gy };
}