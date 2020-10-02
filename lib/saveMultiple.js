const path = require('path');

module.exports = async function(images,imageName) {

    //define the directory to save the image
    const outputFile = path.join(__dirname,'../processed');

    // saves each image and stores the image path for reference
    const imagePaths = await Promise.all(images.map((playerImage,index) => {
        //save the image with a suffix 
        const imagePath = path.join(outputFile,`${imageName}${index}.png`);

        const { image } = playerImage;
        
        return image.save(imagePath)
        .then(() => {
            // remove image 
            delete playerImage[image];

            // return the image path and anything else that was with playerImage;
            return { 
                imagePath,
                ...playerImage
            }
        })
        .catch(error => console.log('ERROR:',error))
    }))

    // returns the location of the saved images
    return imagePaths
}