require('./extendImagePrototype')();
const gameConfig = require('../config/blackOps');


// automatically finds rows within the image. and crops them out
module.exports = function(image) {
    //TODO: crop the x direction dynamically like we do for the y, no need for a config file then.
  
    const { scoreboardBoundary } = gameConfig;

    //crops the x direction from the config file
    image = image.crop(scoreboardBoundary);

    // clone the image
    let boxImage = image.clone();
    
    // detects rows
    boxImage = boxImage.sobelFilter();
    boxImage.save('./cropSobel.png');

    // convert to grey image
    boxImage = boxImage.grey();
    boxImage.save('./cropGrey.png');

    // if under threshold set to black(0) otherwise set to white (255)
    boxImage = boxImage.thresholdBinary(60);
    boxImage.save('./cropThreshold.png');

    // reduces rows to 1 pixel with an intensity value equal to the average of all pixels in the row
    const rowAverage = boxImage
    .getMatrix()
    .map((row,index) => [
        row.reduce((accumulator,currentValue) => accumulator + currentValue,0) / boxImage.width,
        index
    ]);
    if(process.env.NODE_ENV==='development') console.log('rowAverage:',rowAverage);
    // get's the y location of every significant line
    const lines = rowAverage
    .filter(([value,]) => value > 160 )
    .filter(([,lineNumber],index,array) => {
    
        if(index - 1 !== -1){
            return  (lineNumber !== array[index - 1][1] + 1 && lineNumber < boxImage.height - 10)
        } else {
            return true
        }
    })
    if(process.env.NODE_ENV==='development') console.log('Detected lines:',lines);

    // create the scoreboxes
    let scoreBoxes = lines.map(([,lineNumber],index,array) => {
        if(index - 1 !== -1) {
            return {
                x:0,
                y:array[index-1][1],
                width:boxImage.width,
                height: (lineNumber - array[index-1][1])
            }
        }
    })
    .filter(line => line)
    .filter(({height,y}) => height > 5 && y > 10 && height < 60)

    if(!scoreBoxes[0]) scoreBoxes.shift()

    if(process.env.NODE_ENV==='development') console.log('scoreBoxes:',scoreBoxes);

    // special case for team on the bottom, will have a large heigth value
    // let's target this and crop it's x-axis slightly to not resolve the partial 0;
    // const MaxHeight = Math.max(...scoreBoxes.map(({height}) => height))
    // scoreBoxes = scoreBoxes.map(scoreBox => {
    //     let { x, width, height } = scoreBox;
    //     if (height === MaxHeight){
    //         x += 20
    //         width -=700
    //         return {...scoreBox, x, width}
    //     } else {
    //         return scoreBox;
    //     }
    // })
  

    // all heights
    const heights = scoreBoxes.map(scoreBox => scoreBox.height);
    if(process.env.NODE_ENV==='development') console.log('All heights:',heights);
    // unique heights
    const uniqueHeights = [...new Set(heights)];

    if(process.env.NODE_ENV==='development') console.log('Unique heights:',uniqueHeights);

    const counts = uniqueHeights.map(number => {
        const count = heights.join(' ').match(new RegExp(String(number),'g')).length;
        return [number, count]
    });

    if(process.env.NODE_ENV==='development') console.log(counts);

    const modeHeight = counts.find(([,count]) => count === Math.max(...counts.map(([,thisCount])=>thisCount)))[0]

    scoreBoxes = scoreBoxes.map(scoreBox => {
        scoreBox.y += (scoreBox.height - modeHeight) + 5;
        scoreBox.height = modeHeight - 5;
        return scoreBox
    });

    // to include the banner at the top, removing for inconsistent results
    // const topBox = { ...scoreBoxes[0] };
    // topBox.y -= topBox.height + 5;
    // topBox.x += 20;
    // topBox.width -= 20;

    // scoreBoxes.unshift(topBox)


    // crops images into discrete boxes where data is contained
    let images = image.cropMultiple(scoreBoxes);

    return images;
}