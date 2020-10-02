const { Matrix } = require('ml-matrix');

function createROI( pixels, i, j, rows, columns){
    const regionOfInterest = Matrix.zeros(rows,columns)

    const minX = i - (rows - 1)/2;
    const minY = j - (columns - 1)/2;
    
    for (let ii = 0; ii < rows; ii++) {
        for (let jj = 0; jj < columns; jj++) {
            const row = checkPeridoic(minX+ii,0,pixels.rows - 1);
            const column = checkPeridoic(minY+jj,0,pixels.columns - 1);
            if(pixels[row]===undefined) {
                console.log([i,j],pixels[i][j]);
                console.log(minX+ii,row);
                console.log(minY+jj,column);
            }
            regionOfInterest[ii][jj] = pixels[row][column]; 
        }
    }

    return regionOfInterest;
}