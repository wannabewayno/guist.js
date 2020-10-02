require('./lib/extendImagePrototype')();

// Takes in a canny image 
function findLines(image){
    const pixels = image.getMatrix();
    const reducer = (accumulator,currentValue) => accumulator + currentValue; 
    const rowAverages = pixels.map((row,index,array) => row.reduce(reducer,0)/array.length);

    // compute the Average of rowAverages
    const Average = rowAverages.reduce(reducer,0)/rowAverages.length;

    // Compute the std
    const std = Math.sqrt(
        rowAverages
        .map(rowAverage => Math.pow(rowAverage - Average,2))
        .reduce(reducer,0)
        /rowAverages.length
    );

    const lines = rowAverages
        .map((rowAverage,index) => [rowAverage,index])
        .filter(([rowAverage,]) => rowAverage > Average + 2.5*std);

    // console.log('LINES:', lines);
    return lines;
}

function findRows(width, lines) {

    const rows = lines.map(([,thisLine],index,array) => {
        if (index !== array.length - 1) {

            const [, nextLine] = array[index + 1];
    
            // this object is in a format that image.crop(image, options) accepts as options
            return {
                x: 0,
                y: thisLine + 1,
                width,
                height: nextLine - thisLine -1,
            }
        } 
    })
    .filter(defined => defined) // N lines, N-1 boxes. remove the last undefined.
    .filter(row => row.height > 5 ); // remove small rows, (can't possibly be scores if this small).

    return rows
}

function CropIntoRows(image, cannyImage , rows) {
    // crop the image into many images, 1 image per detected row.
    // crop size is determined by the row coordinates.
    const rowImages = image.cropMultiple(rows);
    const cannyRowImages = cannyImage.cropMultiple(rows);

    // Couple the cropped image and it's cropped cannyImage counterpart
    return rowImages.map((row,index) => [ row, cannyRowImages[index] ]); 
}

module.exports = function({ image, cannyImage }) {
    const lines = findLines(cannyImage);
    const rows = findRows(image.width, lines);
    return CropIntoRows(image, cannyImage, rows);
    // images.forEach((image,index) => image.save(`./${fileName} - ${index}.png`));
}