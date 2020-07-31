const { Image } = require('image-js');

module.exports = function(){
    Image.prototype.thresholdBinary = function(threshold){
        const channels = this.channels;
        this.data = this.data.map((pixel,index) => {
            if(pixel < threshold && ((index+1)/channels)%1!==0){
                return 0;
            } else {
                return 255;
            }
        });
        return this;
    },

    Image.prototype.findRows = function () {
        const rowAverage = boxImage.getMatrix({channels:boxImage.channels}).map((row,index) => [row.reduce((accumulator,currentValue) => accumulator + currentValue,0)/boxImage.width,index]);
        
        const lines = rowAverage
        .filter(([value,]) => value > 90 )
        .filter(([,lineNumber],index,array) => {
           
            if(index - 1 !== -1){
                return  lineNumber !== array[index - 1][1] + 1
            } else {
                return true
            }
        })
        console.log(lines);
        const scoreBoxes = lines.map(([,lineNumber],index,array) => {
            if(index - 1 !== -1) {
                return {
                    x:0,
                    y:array[index-1][1] + 2,
                    width:this.width,
                    height: (lineNumber - array[index-1][1]) - 5
                }
            }// } else if (array.length > 2) {
            //     return {
            //         x:0,
            //         y: lineNumber - (array[index+2][1] - array[index+1][1]) + 2,
            //         width:this.width,
            //         height: (array[index+2][1] - array[index+1][1]) - 5
            //     }
            // }
        })

        if(!scoreBoxes[0]) scoreBoxes.shift() 

        // all heights
        const heights = scoreBoxes.map(scoreBox => scoreBox.height);

        // unique heights
        const uniqueHeights = [...new Set(heights)];
        console.log(uniqueHeights);

        const counts = uniqueHeights.map(number => {
            console.log(number);
            const count = heights.join(' ').match(new RegExp(String(number),'g')).length;
            console.log(count);
            return [number, count]
        });

        const modeHeight = counts.find(([,count]) => count === Math.max(...counts.map(([,thisCount])=>thisCount)))[0]
        console.log('MAXCOUNT',modeHeight);

        scoreBoxes.forEach(scoreBox => {
            scoreBox.y += scoreBox.height - modeHeight;
            scoreBox.height = modeHeight;
        });

        console.log(scoreBoxes);

        const topBox = { ...scoreBoxes[0] };
        topBox.y -= topBox.height + 2;
        scoreBoxes.unshift(topBox)

        console.log(scoreBoxes);
        // returns an array of y1,y0 values that defines positions of rows
        return scoreBoxes
    }
}
