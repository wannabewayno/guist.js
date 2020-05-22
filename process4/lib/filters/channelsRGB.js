const { split, matrixForm, combine } = require('./helpers.js');
require('./mathExtension.js');


const HSL2RGB = (H,S,L) => {
    S /= 100;
    L /= 100;

    const C = (1 - Math.abs(2*L-1))*S;
    const X = C * (1-Math.abs( ( (H/60) % 2 ) - 1 ));
    const m = L - ( C / 2 );
    
    let RGB;

    if (0<=H && H < 60) {
        RGB = [C,X,0]
    }
    if(60<=H && H < 120) {
        RGB = [X,C,0]            
    }
    if(120<=H && H < 180) {
        RGB = [0,C,X]
    }
    if(180<=H && H < 240) {
        RGB = [0,X,C]
    }
    if(240<=H && H < 300) {
        RGB = [X,0,C]
    }
    if(300<=H && H < 360) {
        RGB = [C,0,X]
    }

    RGB = RGB.map(value => value = Math.round((value + m)*255));

    return RGB;
}




module.exports = {
   

    /** channelsRGB
     * takes in a channel object and converts them to the RGB colourModel
     * @param {object} channels: a channels object { <channelName>:<array>, <channelName>:<array>, <channelName>:<array> }
     * @param {Image}  image
     * @param {Image}  image
     */
    convertRGB: (image,pixelsArray) => {
        //first we need to combine the 3 1D channels into a 1D of 3D channels
        // pixelsArray = combine(channels); 
        
        //then map that with HSL2RGB
        pixelsArray = pixelsArray.map(pixel => HSL2RGB(...pixel));
        
        //then split that again into 3 1D channels
        channels = split(pixelsArray,'RGB');

        //convert this to matrix form
        channelMatrix = matrixForm(channels,image);
        
        //set the appropriate components with the appropriate channels
        image.setMatrix(channelMatrix.red,{channel:0})
        image.setMatrix(channelMatrix.green,{channel:1})
        image.setMatrix(channelMatrix.blue,{channel:2})

        //finally return the image
        return image
    }
}
