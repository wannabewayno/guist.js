require('./lib/extendImagePrototype')();

function cropToScoreboardWidth(image, horizontalLines) {

    if(horizontalLines.length < 2) return;

    // first and last lines will define the scoreboard
    // all others will be dividers inside the board, we ignore these
    const first = horizontalLines.shift()[1];
    const last = horizontalLines.pop()[1];

    // find the coordinates of a box that defines where to crop the image
    return image.crop({
        x: first + 1,             // start at this x coordinate
        y: 0,                 // start at this y coordinate
        width: last - first - 1,  // crop width
        height: image.height, // crop height
    })
}

/**
 * checks to see if lines are close to each other and returns the line closest to the middle
 */
function reduceNearLines(lines, options){
    const defaultOptions = {
        center:0,
        threshold:5
    }
    // merge default options and user options
    options = { ...defaultOptions, ...options };

    const linesToRemove =  lines.map(([,currentLine],index,array) => {
        if(!array[index+1]) return;

        const [,nextLine] = array[index+1];
        const difference = Math.abs(nextLine - currentLine);
        const { threshold, center } = options;

        if(difference <= threshold){
            // give back the line closest to the center
            const currentDifference = Math.abs(currentLine - center);
            const nextDifference = Math.abs(nextLine - center);
            return currentDifference < nextDifference ? nextLine : currentLine;
        } else {
            return undefined;
        }
    })
    .filter(defined => defined);

    console.log('linesToRemove:', linesToRemove);
    return lines.filter(([,lineNumber]) => !linesToRemove.includes(lineNumber))
}

function findHorizontalLines(image) {
    const pixels = image.getMatrix().transpose();

    const reducer = (accumulator,currentValue) => accumulator + currentValue; 
    // reduces (x,y) matrix of pixels to an Array of pixel averages in columns 
    const columnAverages = pixels.map(column => column.reduce(reducer,0)/column.length);

    // compute the Average of rowAverages
    const Average = columnAverages.reduce(reducer,0)/columnAverages.length;

    // Compute the std
    const std = Math.sqrt(
        columnAverages
        .map(columnAverage => Math.pow(columnAverage - Average,2))
        .reduce(reducer,0)
        /columnAverages.length
    );

    console.log('AVERAGE:',Average, 'STD:', std);

    const lines = columnAverages
        .map((columnAverage,index) => [ columnAverage, index ])
        .filter(([columnAverage,]) => columnAverage > 0.60*255);

    const newLines = reduceNearLines(lines,{center:image.width/2});
    console.log(newLines);
    return newLines
}

module.exports =  function (images) {
    // finds horizontal lines from the canny image.
    images = images.map(([ rowImage, rowCannyImage ]) => [ rowImage, findHorizontalLines(rowCannyImage) ]);

    // crop the image to the scoreboardBoundary
    images = images.map(([rowImage, horizontalLines]) => cropToScoreboardWidth(rowImage, horizontalLines) );

    // return images cropped to the scoreboard width
    return images.filter(defined => defined);
}