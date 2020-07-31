const path = require('path');

module.exports = async function(images) {
    
    //define the directory to save the image
    const outputFile = path.join(__dirname,'../processed');

    // saves each image and stores the image path for reference
    const imagePaths = await Promise.all(images.map((image,index) => {
        //save the image with a suffix 
        const imagePath = path.join(outputFile,`output${index}.png`);
        
        return image.save(imagePath)
        .then(success => imagePath)
        .catch(error => console.log('ERROR:',error))
    }))
    // returns the location of the saved images
    return imagePaths
}